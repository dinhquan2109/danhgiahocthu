import { GOOGLE_SHEETS_CONFIG } from '../config.js';

class GoogleSheetsService {
  constructor() {
    this.sheetId = GOOGLE_SHEETS_CONFIG.SHEET_ID;
    this.clientId = GOOGLE_SHEETS_CONFIG.CLIENT_ID;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    this.accessToken = null;
  }

  // Khởi tạo Google Identity Services (GIS) mới
  async initializeGoogleAPI() {
    return new Promise((resolve, reject) => {
      console.log('🔍 Checking Google Identity Services availability...');
      
      // Kiểm tra nếu Google Identity Services đã được load
      if (window.google && window.google.accounts) {
        this.authenticateWithGIS().then(resolve).catch(reject);
        return;
      }

      // Đợi Google Identity Services load
      const checkGIS = () => {
        if (window.google && window.google.accounts) {
          console.log('✅ Google Identity Services loaded');
          this.authenticateWithGIS().then(resolve).catch(reject);
        } else {
          console.log('⏳ Waiting for Google Identity Services...');
          setTimeout(checkGIS, 100);
        }
      };
      
      checkGIS();
    });
  }

  // Xác thực với Google Identity Services
  async authenticateWithGIS() {
    return new Promise((resolve, reject) => {
      try {
        console.log('🔐 Initializing Google Identity Services...');
        
        // Khởi tạo Google Identity Services
        window.google.accounts.id.initialize({
          client_id: this.clientId,
          callback: (response) => {
            console.log('✅ Google Identity Services callback received');
            console.log('🔑 JWT Token received:', response.credential ? 'Yes' : 'No');
            
            // Lưu JWT token
            this.accessToken = response.credential;
            resolve(true);
          }
        });

        console.log('🔑 Prompting Google Sign-In...');
        // Hiển thị popup đăng nhập
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('⚠️ Google Sign-In popup was not displayed or skipped');
            reject(new Error('Google Sign-In popup was not displayed'));
          } else {
            console.log('✅ Google Sign-In popup displayed');
          }
        });
      } catch (error) {
        console.error('❌ Error with Google Identity Services:', error);
        reject(error);
      }
    });
  }

  // Lấy danh sách dữ liệu đã có
  async getExistingData() {
    try {
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

      console.log('📊 Fetching data from Google Sheets...');
      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rows = data.values || [];
      
      console.log(`✅ Fetched ${rows.length} rows from Google Sheets`);
      
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
      console.error('❌ Error fetching data:', error);
      throw error;
    }
  }

  // Ghi kết quả đánh giá vào Google Sheets
  async saveEvaluation(evaluationData) {
    try {
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

      console.log('💾 Saving evaluation with Google Identity Services');
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

      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      });
      
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
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

      console.log('🔍 Testing Google Sheets connection...');
      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A1`;
      const url = `${this.baseUrl}/${this.sheetId}/values/${range}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('❌ Connection failed:', response.status);
        return false;
      }
      
      console.log('✅ Connection successful with Google Identity Services');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();
