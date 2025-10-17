import { GOOGLE_SHEETS_CONFIG } from '../config.js';

class GoogleSheetsService {
  constructor() {
    this.sheetId = GOOGLE_SHEETS_CONFIG.SHEET_ID;
    this.apiKey = GOOGLE_SHEETS_CONFIG.API_KEY;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Lấy danh sách dữ liệu đã có
  async getExistingData() {
    try {
      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}?key=${this.apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const rows = data.values || [];
      
      // Bỏ qua header row (row đầu tiên)
      const evaluations = rows.slice(1).map((row, index) => ({
        id: index + 1,
        name: row[0] || '',
        classId: row[1] || '',
        nameTeacher: row[2] || '',
        level: row[3] || '',
        status: row[4] || '',
        criteria1: row[5] || '',
        criteria2: row[6] || '',
        criteria3: row[7] || '',
        criteria4: row[8] || '',
        criteria5: row[9] || '',
        date: row[10] || ''
      }));
      
      return evaluations;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  // Ghi kết quả đánh giá vào Google Sheets
  async saveEvaluation(evaluationData) {
    try {
      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
      
      console.log('💾 Saving evaluation to:', url);
      console.log('📊 Evaluation data:', evaluationData);
      
      // Chuyển đổi ratings thành các giá trị tương ứng
      const getStatusValue = (rating) => {
        const statusMap = {
          1: 'Rất hạn chế',
          2: 'Yếu', 
          3: 'Trung bình',
          4: 'Tốt',
          5: 'Rất tốt/Tiềm năng cao'
        };
        return statusMap[rating] || '';
      };

      const getCriteriaValue = (rating) => {
        const criteriaMap = {
          1: 'Học viên còn rụt rè, chưa tương tác nhiều với giáo viên, cần hỗ trợ và khơi gợi thêm',
          2: 'Học viên có một số tương tác cơ bản nhưng còn hạn chế, cần khuyến khích thêm',
          3: 'Học viên tương tác ở mức trung bình, có thể cải thiện thêm',
          4: 'Học viên tương tác tốt, có sự tiến bộ rõ rệt',
          5: 'Học viên tương tác xuất sắc, có tiềm năng cao'
        };
        return criteriaMap[rating] || '';
      };
      
      const values = [
        [
          evaluationData.studentName,                    // A: Tên học viên
          evaluationData.classCode,                      // B: Mã lớp
          evaluationData.teacherName,                   // C: Tên giáo viên
          evaluationData.level,                          // D: Trình độ
          getStatusValue(evaluationData.ratings.communication || evaluationData.ratings.pronunciation || 1), // E: Status
          getCriteriaValue(evaluationData.ratings.communication || 1), // F: Tiêu chí 1
          getCriteriaValue(evaluationData.ratings.pronunciation || 1), // G: Tiêu chí 2
          getCriteriaValue(evaluationData.ratings.vocabulary || 1),    // H: Tiêu chí 3
          getCriteriaValue(evaluationData.ratings.listening || 1),     // I: Tiêu chí 4
          getCriteriaValue(evaluationData.ratings.reading || 1),       // J: Tiêu chí 5
          new Date().toISOString().split('T')[0]        // K: Ngày đánh giá
        ]
      ];
      
      console.log('📝 Values to save:', values);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });
      
      console.log('📡 Save response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Save failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Save successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Error saving evaluation:', error);
      throw error;
    }
  }

  // Kiểm tra kết nối Google Sheets
  async testConnection() {
    try {
      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A1`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}?key=${this.apiKey}`;
      
      console.log('🔍 Testing connection to:', url);
      const response = await fetch(url);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Connection failed:', errorText);
        return false;
      }
      
      console.log('✅ Connection successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();
