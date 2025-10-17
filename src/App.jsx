import React, { useState, useEffect } from 'react';
import { FileText, Save, AlertCircle, CheckCircle } from 'lucide-react';
import googleSheetsService from './services/googleSheetsService';

const TrialEvaluationForm = () => {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [hoveredRating, setHoveredRating] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [validationError, setValidationError] = useState('');

  const levels = {
    'I': 'I. Cho người mới bắt đầu',
    'II': 'II. Cho người đã có nền tảng',
    'III': 'III. Khoá giao tiếp cho người mới bắt đầu'
  };

  const ratingLabels = {
    1: 'Rất hạn chế',
    2: 'Yếu',
    3: 'Trung bình',
    4: 'Tốt',
    5: 'Rất tốt/Tiềm năng cao'
  };

  const evaluationData = {
    'I': {
      'focus': {
        label: 'Mức độ tập trung và hợp tác trong buổi học',
        descriptions: [
          'Học viên còn rụt rè, chưa tương tác nhiều với giáo viên, cần hỗ trợ và khơi gợi thêm.',
          'Học viên có tham gia nhưng thiếu chủ động, cần thêm động lực để duy trì sự tập trung.',
          'Học viên hợp tác ở mức ổn, có lúc mất tập trung nhưng nhìn chung theo được buổi học.',
          'Học viên chủ động hợp tác, phản hồi tốt khi được hỏi, tinh thần học nghiêm túc.',
          'Học viên rất tập trung, hợp tác tích cực, tạo không khí học vui vẻ và hiệu quả.'
        ]
      },
      'comprehension': {
        label: 'Phản ứng và mức độ tiếp thu với nội dung mới',
        descriptions: [
          'Học viên chưa bắt nhịp được với nội dung, cần giáo viên hỗ trợ chậm và lặp lại nhiều lần.',
          'Học viên hiểu chậm, đôi khi phản ứng muộn, nhưng có cố gắng ghi nhớ.',
          'Học viên nắm được phần chính, tuy còn chậm nhưng có tiến bộ rõ trong buổi học.',
          'Học viên phản ứng nhanh, hiểu ý giáo viên, bắt chước và ghi nhớ khá tốt.',
          'Học viên phản ứng nhanh, ghi nhớ tốt, thể hiện khả năng tiếp thu nổi bật.'
        ]
      },
      'pronunciation': {
        label: 'Phát âm và bắt chước tiếng Trung',
        descriptions: [
          'Học viên gặp khó khăn khi phát âm, cần nhiều thời gian làm quen ngữ âm.',
          'Học viên bắt chước được nhưng chưa chính xác, cần luyện thêm phần thanh điệu.',
          'Học viên có thể phát âm đúng vài âm cơ bản, đã biết điều chỉnh theo hướng dẫn.',
          'Học viên phát âm khá tốt cho người mới, có khả năng nhận diện âm thanh chuẩn.',
          'Học viên phát âm tốt, tiếp thu nhanh, rất có năng khiếu ngôn ngữ.'
        ]
      },
      'memory': {
        label: 'Khả năng ghi nhớ và phản hồi lại từ/câu đơn giản',
        descriptions: [
          'Học viên cần thêm thời gian và phương pháp ghi nhớ phù hợp.',
          'Học viên có thể nhắc lại nhưng còn nhầm lẫn, cần củng cố thêm.',
          'Học viên nhớ được phần cơ bản, cần luyện thêm để ghi nhớ lâu hơn.',
          'Học viên ghi nhớ nhanh, phản hồi tốt, đã biết liên hệ giữa âm – nghĩa.',
          'Học viên phản hồi nhanh, ghi nhớ tốt, khả năng tiếp thu từ vựng rất tốt.'
        ]
      },
      'attitude': {
        label: 'Thái độ học tập/ Năng khiếu học tập',
        descriptions: [
          'Học viên chưa sẵn sàng về tinh thần học, cần thời gian làm quen môi trường học.',
          'Học viên hơi thụ động, cần được khích lệ thêm để tạo hứng thú học tập.',
          'Học viên hợp tác tốt khi được khuyến khích, có nền tảng để phát triển thêm.',
          'Học viên hứng thú với bài học, chủ động tương tác, tiềm năng phát triển tốt.',
          'Học viên có thái độ học tập xuất sắc, rất tiềm năng để tiến bộ nhanh.'
        ]
      }
    },
    'II': {
      'communication': {
        label: 'Giao tiếp & phản xạ',
        descriptions: [
          'Học viên cần thêm thời gian để quen với phản xạ giao tiếp.',
          'Có nền tảng cơ bản, nên luyện phản ứng nhanh hơn.',
          'Phản xạ khá ổn, cần luyện thêm để nói trôi chảy hơn.',
          'Tương tác tốt, giao tiếp khá linh hoạt.',
          'Rất tự tin và tự nhiên khi giao tiếp, khả năng phản xạ xuất sắc.'
        ]
      },
      'pronunciation': {
        label: 'Phát âm & ngữ pháp',
        descriptions: [
          'Cần tập trung sửa phát âm và làm quen với cấu trúc câu.',
          'Có tiến bộ, nên chú ý hơn vào thanh điệu và ngữ pháp.',
          'Phát âm khá ổn, nên luyện thêm để đạt độ tự nhiên.',
          'Ngữ pháp và phát âm tốt, chỉ cần trau chuốt thêm.',
          'Sử dụng tiếng Trung rất chuẩn, phát âm và ngữ pháp ổn định.'
        ]
      },
      'listening': {
        label: 'Nghe hiểu',
        descriptions: [
          'Nên nghe thêm các đoạn ngắn chậm để luyện phản xạ.',
          'Hiểu được từ chính, cần luyện thêm khả năng đoán ý.',
          'Nghe ổn, chỉ cần cải thiện tốc độ phản hồi.',
          'Khả năng nghe tốt, hiểu đa số chủ đề thường gặp.',
          'Nghe hiểu xuất sắc, có thể bắt kịp tốc độ tự nhiên hoàn toàn.'
        ]
      },
      'vocabulary': {
        label: 'Từ vựng & cách diễn đạt',
        descriptions: [
          'Cần mở rộng thêm vốn từ vựng theo chủ đề.',
          'Biết nhiều từ cơ bản, nên luyện ghép câu và mở rộng chủ đề.',
          'Dùng từ ổn, có thể luyện thêm để diễn đạt phong phú hơn.',
          'Cách diễn đạt tự nhiên, vốn từ khá tốt.',
          'Biểu đạt linh hoạt, vốn từ phong phú và đa dạng.'
        ]
      },
      'attitude': {
        label: 'Thái độ & tinh thần học',
        descriptions: [
          'Cần khuyến khích để tự tin hơn khi học.',
          'Có tiềm năng, nên tập trung hơn trong giờ học.',
          'Thái độ học tốt, nên duy trì đều đặn.',
          'Chủ động và tích cực, tiếp thu nhanh.',
          'Rất chủ động, tinh thần học nghiêm túc và cầu tiến.'
        ]
      }
    },
    'III': {
      'communication': {
        label: 'Giao tiếp & phản xạ',
        descriptions: [
          'Cần thêm thời gian làm quen với phản xạ giao tiếp.',
          'Đã hiểu ý, nên luyện phản ứng nhanh và rõ hơn.',
          'Biết phản ứng cơ bản, cần luyện nói to và trôi chảy hơn.',
          'Phản xạ khá tốt, giao tiếp tự nhiên.',
          'Tự tin, phản xạ tốt, rất phù hợp học giao tiếp.'
        ]
      },
      'pronunciation': {
        label: 'Phát âm & thanh điệu',
        descriptions: [
          'Phát âm sai nhiều, chưa quen thanh điệu.',
          'Biết cách phát âm nhưng còn sai hoặc chưa rõ.',
          'Phát âm dễ hiểu, đôi khi sai thanh điệu.',
          'Phát âm chuẩn hơn, có ngữ điệu rõ.',
          'Phát âm chuẩn, rõ ràng, nói tự nhiên.'
        ]
      },
      'listening': {
        label: 'Nghe hiểu',
        descriptions: [
          'Cần nghe chậm để làm quen với âm thanh tiếng Trung.',
          'Đã nghe ra vài từ, cần luyện thêm.',
          'Nghe khá ổn, cần phản ứng nhanh hơn.',
          'Nghe tốt, hiểu ý chính.',
          'Nghe hiểu tốt, phản xạ nhanh và chính xác.'
        ]
      },
      'vocabulary': {
        label: 'Từ vựng & cách diễn đạt',
        descriptions: [
          'Cần học thêm từ vựng cơ bản.',
          'Có nền tảng, nên luyện ghép từ thành câu.',
          'Dùng câu ngắn khá tốt, cần nói đầy đủ hơn.',
          'Vốn từ ổn, diễn đạt tự nhiên.',
          'Vốn từ tốt, nói trôi chảy, rõ ràng.'
        ]
      },
      'attitude': {
        label: 'Thái độ & tinh thần học',
        descriptions: [
          'Còn ngại nói, ít tương tác.',
          'Có tham gia nhưng chưa đều.',
          'Hợp tác tốt, chịu khó học.',
          'Chủ động, tích cực hỏi – trả lời.',
          'Rất chủ động, tự tin và có mục tiêu học rõ ràng.'
        ]
      }
    }
  };

  const [formData, setFormData] = useState({
    studentName: '',
    classCode: '',
    teacherName: '',
    level: '',
    ratings: {}
  });

  const handleLevelSelect = (levelKey) => {
    setFormData({
      studentName: formData.studentName,
      classCode: formData.classCode,
      teacherName: formData.teacherName,
      level: levelKey,
      ratings: {}
    });
    setSelectedLevel(levelKey);
    // Clear validation error when level is selected
    setValidationError('');
  };

  const handleCriteriaClick = (criteriaKey, ratingValue) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [criteriaKey]: ratingValue
      }
    }));
    // Clear validation error when rating is selected
    setValidationError('');
  };


  // Load available classes from Google Sheets
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setConnectionStatus('checking');
        
        // Đợi một chút để Google API script được load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('🚀 Starting Google API initialization...');
        
        // Initialize Google API first
        await googleSheetsService.initializeGoogleAPI();
        
        console.log('🔍 Testing Google Sheets connection...');
        const isConnected = await googleSheetsService.testConnection();
        
        if (isConnected) {
          console.log('📊 Loading existing data from Google Sheets...');
          const data = await googleSheetsService.getExistingData();
          setAvailableClasses(data);
          setConnectionStatus('connected');
          console.log('✅ Successfully connected to Google Sheets');
        } else {
          console.log('❌ Failed to connect to Google Sheets');
          setConnectionStatus('disconnected');
        }
      } catch (error) {
        console.error('❌ Error loading classes:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setConnectionStatus('error');
        
        // Fallback: Show message that data will be saved locally
        console.log('⚠️ Google Sheets connection failed, data will be saved locally');
      }
    };

    loadClasses();
  }, []);

  const handleSaveEvaluation = async () => {
    // Debug: Log thông tin để kiểm tra
    console.log('Form Data:', formData);
    console.log('Selected Level:', selectedLevel);
    console.log('Ratings:', formData.ratings);

    // Reset validation error
    setValidationError('');

    // Kiểm tra thông tin cơ bản
    if (!formData.studentName || !formData.classCode || !formData.teacherName) {
      const missingFields = [];
      if (!formData.studentName) missingFields.push('Họ tên học viên');
      if (!formData.classCode) missingFields.push('Mã lớp');
      if (!formData.teacherName) missingFields.push('Tên giáo viên');
      
      setValidationError(`Vui lòng điền đầy đủ: ${missingFields.join(', ')}`);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
      return;
    }

    // Kiểm tra trình độ đã chọn
    if (!selectedLevel) {
      setValidationError('Vui lòng chọn trình độ lớp học');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
      return;
    }

    // Kiểm tra đã đánh giá ít nhất 1 tiêu chí
    if (Object.keys(formData.ratings).length === 0) {
      setValidationError('Vui lòng đánh giá ít nhất 1 tiêu chí');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 5000);
      return;
    }

    setLoading(true);
    setSaveStatus('');

    try {
      const evaluationData = {
        studentName: formData.studentName,
        classCode: formData.classCode,
        teacherName: formData.teacherName,
        level: selectedLevel,
        ratings: formData.ratings,
        comments: ''
      };

      // Save to localStorage first (backup)
      const existingData = JSON.parse(localStorage.getItem('evaluationsList') || '[]');
      const newEvaluation = {
        ...evaluationData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      existingData.push(newEvaluation);
      localStorage.setItem('evaluationsList', JSON.stringify(existingData));

      // Try to save to Google Sheets (optional)
      try {
        await googleSheetsService.saveEvaluation(evaluationData);
        console.log('✅ Saved to Google Sheets successfully');
      } catch (sheetsError) {
        console.warn('⚠️ Google Sheets save failed, but data saved to localStorage:', sheetsError);
        // Data is still saved to localStorage, so we continue
      }
      
      setSaveStatus('success');
      
      // Reset form
      setFormData({
        studentName: '',
        classCode: '',
        teacherName: '',
        level: '',
        ratings: {}
      });
      setSelectedLevel('');
      
      // Try to reload data from Google Sheets
      try {
        const data = await googleSheetsService.getExistingData();
        setAvailableClasses(data);
      } catch (reloadError) {
        console.warn('⚠️ Could not reload from Google Sheets:', reloadError);
        // Continue without error
      }
      
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving evaluation:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-400 to-purple-600 py-4 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-4 mb-4 border-t-4 border-emerald-500">
          <div className="text-center">
            <div className="inline-block mb-2">
              <img 
                src="https://axllpuaybdzubfmsfkws.supabase.co/storage/v1/object/sign/testsiteaudio_HSK1_2/logoaloha.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mMTcyMjBlMC00MTM3LTRmMGEtYTg5OC04NTk1ODhmOTdiYWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZXN0c2l0ZWF1ZGlvX0hTSzFfMi9sb2dvYWxvaGEuanBnIiwiaWF0IjoxNzYwNzI0Mzg2LCJleHAiOjE5MTg0MDQzODZ9.Sah42nsGOjJgwVUX12SraxiWLtslG43Qw-RqTCh7aYQ" 
                alt="Logo" 
                className="w-24 h-24 rounded-full object-cover shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              PHIẾU ĐÁNH GIÁ HỌC THỬ
            </h1>
            <p className="text-gray-600 text-xs">Hệ thống đánh giá nội bộ</p>
          </div>
        </div>

        <div className="w-full">
          {/* Connection Status */}
          <div className="mb-4">
            {connectionStatus === 'checking' && (
              <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm">
                🔄 Đang kiểm tra kết nối Google Sheets...
              </div>
            )}
            {connectionStatus === 'connected' && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm">
                ✅ Đã kết nối Google Sheets ({availableClasses.length} bản ghi dữ liệu)
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-lg text-sm">
                ⚠️ Không thể kết nối Google Sheets. Vui lòng kiểm tra cấu hình.
              </div>
            )}
            {connectionStatus === 'error' && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
                ❌ Lỗi kết nối Google Sheets. Vui lòng kiểm tra lại cấu hình.
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-4 border-2 border-white">
            {/* Thông tin học viên */}
            <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-2xl">★</span>
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    THÔNG TIN HỌC VIÊN
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none text-sm"
                  placeholder="* Họ tên học viên"
                />

                <input
                  type="text"
                  value={formData.classCode}
                  onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none text-sm"
                  placeholder="* Mã lớp"
                />

                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none text-sm"
                  placeholder="* Tên giáo viên"
                />

                {/* Trình độ lớp học - ẩn như placeholder */}
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <select
                    value={selectedLevel}
                    onChange={(e) => handleLevelSelect(e.target.value)}
                    className="w-full px-3 py-2 focus:outline-none text-sm text-gray-500 bg-white"
                  >
                    <option value="">* Trình độ lớp học</option>
                    {Object.entries(levels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Đánh giá chi tiết */}
            {selectedLevel && (
              <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-2xl">★</span>
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      ĐÁNH GIÁ CHI TIẾT
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(evaluationData[selectedLevel]).map(([criteriaKey, criteriaData]) => (
                    <div key={criteriaKey} className="relative flex">
                      {/* Phần bên trái - Danh sách lựa chọn */}
                      <div className="w-1/2 pr-4">
                        <h3 className="font-bold text-gray-800 text-base mb-3">{criteriaData.label}</h3>
                        
                        <div className="space-y-0.5">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div key={rating} className="relative group">
                              <button
                                onClick={() => handleCriteriaClick(criteriaKey, rating)}
                                onMouseEnter={() => setHoveredRating(`${criteriaKey}-${rating}`)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className={`w-full text-left px-4 py-0.5 rounded-md border-2 transition-all duration-200 text-sm ${
                                  formData.ratings[criteriaKey] === rating
                                    ? 'border-purple-500 bg-purple-100 text-purple-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                              >
                                {rating}. {ratingLabels[rating]}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Phần bên phải - Hiển thị mô tả khi hover */}
                      <div className="w-1/2 pl-4">
                        {hoveredRating && hoveredRating.startsWith(`${criteriaKey}-`) && (
                          <div className="sticky top-4">
                            <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 shadow-lg relative">
                              <div className="text-sm text-gray-700 leading-relaxed">
                                {criteriaData.descriptions[parseInt(hoveredRating.split('-')[1]) - 1]}
                              </div>
                              {/* Speech bubble tail */}
                              <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-300 transform rotate-45"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Message */}
            {saveStatus && (
              <div className={`mb-4 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-medium ${
                saveStatus === 'success'
                  ? 'bg-green-100 border border-green-300 text-green-700'
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                {saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Lưu đánh giá thành công!
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {validationError || 'Lỗi! Vui lòng kiểm tra lại thông tin'}
                  </>
                )}
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveEvaluation}
              disabled={loading || !selectedLevel}
              className="w-full bg-gradient-to-r from-orange-400 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-orange-500 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'ĐANG LƯU...' : 'GỬI ĐÁNH GIÁ'}
            </button>

            {/* Export Button */}
            <button
              onClick={async () => {
                try {
                  const localData = JSON.parse(localStorage.getItem('evaluationsList') || '[]');
                  if (localData.length === 0) {
                    alert('Không có dữ liệu để export');
                    return;
                  }
                  
                  for (const item of localData) {
                    await googleSheetsService.saveEvaluation(item);
                  }
                  alert(`Đã export ${localData.length} bản ghi vào Google Sheets`);
                } catch (error) {
                  console.error('Export error:', error);
                  alert('Lỗi khi export dữ liệu');
                }
              }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              📤 Export dữ liệu vào Google Sheets
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TrialEvaluationForm;
