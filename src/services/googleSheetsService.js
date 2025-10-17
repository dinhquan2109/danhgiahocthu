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
      
      const response = await fetch(this.apiUrl);
      
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluationData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save data');
      }
      
      console.log('✅ Save successful:', result.message);
      return result;
    } catch (error) {
      console.error('❌ Error saving evaluation:', error);
      throw error;
    }
  }

  // Kiểm tra kết nối Google Sheets
  async testConnection() {
    try {
      console.log('🔍 Testing Google Apps Script connection...');
      
      const response = await fetch(this.apiUrl);
      
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
