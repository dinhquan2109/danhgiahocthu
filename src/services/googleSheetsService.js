import { GOOGLE_SHEETS_CONFIG } from '../config.js';

class GoogleSheetsService {
  constructor() {
    this.sheetId = GOOGLE_SHEETS_CONFIG.SHEET_ID;
    this.clientId = GOOGLE_SHEETS_CONFIG.CLIENT_ID;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    this.accessToken = null;
  }

  // Khởi tạo Google API và xác thực
  async initializeGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.loadSheetsAPI().then(resolve).catch(reject);
        return;
      }

      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          this.loadSheetsAPI().then(resolve).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Load Google Sheets API
  async loadSheetsAPI() {
    try {
      await window.gapi.client.init({
        apiKey: 'AIzaSyB3ZNmQMNbJv_LgPtJ17aQKG-qyNQw6Jcg', // Fallback API key
        clientId: this.clientId,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      });

      // Kiểm tra xem user đã đăng nhập chưa
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      this.accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
      return true;
    } catch (error) {
      console.error('Error initializing Google API:', error);
      throw error;
    }
  }

  // Lấy danh sách dữ liệu đã có
  async getExistingData() {
    try {
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: range
      });

      const rows = response.result.values || [];
      
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
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

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

      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A:K`;
      const response = await window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: range,
        valueInputOption: 'USER_ENTERED',
        values: values
      });
      
      return response.result;
    } catch (error) {
      console.error('Error saving evaluation:', error);
      throw error;
    }
  }

  // Kiểm tra kết nối Google Sheets
  async testConnection() {
    try {
      if (!this.accessToken) {
        await this.initializeGoogleAPI();
      }

      const range = `${GOOGLE_SHEETS_CONFIG.SHEETS.DATA}!A1`;
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: range
      });
      
      return response.result !== undefined;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();
