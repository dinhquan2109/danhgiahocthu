import { GOOGLE_SHEETS_CONFIG } from '../config.js';

class GoogleSheetsService {
  constructor() {
    this.apiUrl = GOOGLE_SHEETS_CONFIG.APPS_SCRIPT_URL;
  }

  // Khởi tạo Google Apps Script API (không cần authentication)
  async initializeGoogleAPI() {
    console.log('✅ Google Apps Script API ready (no authentication needed)');
    return true;
  }

  // Lấy danh sách dữ liệu đã có
  async getExistingData() {
    try {
      console.log('📊 Fetching data from Google Apps Script...');
      
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        mode: 'cors' // GET request vẫn dùng cors để đọc response
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      console.log(`✅ Fetched ${data.data.length} rows from Google Sheets`);
      return data.data;
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      throw error;
    }
  }

  // Ghi kết quả đánh giá vào Google Sheets
  async saveEvaluation(evaluationData) {
    try {
      console.log('💾 Saving evaluation with Google Apps Script');
      console.log('📊 Evaluation data:', evaluationData);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        mode: 'no-cors', // ← THÊM DÒNG NÀY để bypass CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData)
      });
      
      // Với no-cors, không đọc được response.json()
      // Giả định thành công nếu không có lỗi
      console.log('✅ Data sent successfully (no-cors mode)');
      
      return { success: true, message: 'Data saved successfully' };
    } catch (error) {
      console.error('❌ Error saving evaluation:', error);
      throw error;
    }
  }

  // Kiểm tra kết nối Google Sheets
  async testConnection() {
    try {
      console.log('🔍 Testing Google Apps Script connection...');
      
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        mode: 'cors' // GET request vẫn dùng cors để đọc response
      });
      
      if (!response.ok) {
        console.error('❌ Connection failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('❌ API error:', data.error);
        return false;
      }
      
      console.log('✅ Connection successful with Google Apps Script');
      return true;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      return false;
    }
  }
}

export default new GoogleSheetsService();
