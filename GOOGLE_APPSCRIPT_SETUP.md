# 🔧 Hướng dẫn tạo Google Apps Script API

## 📋 **Bước 1: Tạo Google Apps Script**

1. **Truy cập Google Apps Script:**
   - Vào [script.google.com](https://script.google.com)
   - Đăng nhập bằng tài khoản Google

2. **Tạo project mới:**
   - Click "New Project"
   - Đặt tên: "Đánh giá học thử API"

## 📝 **Bước 2: Tạo Code.gs**

Thay thế toàn bộ code trong file `Code.gs`:

```javascript
// Cấu hình Google Sheets
const SHEET_ID = '1H-nLX-zMzoxGJAB2HV-bP6_cIiPInVlYz4zYjs0KiLw';
const SHEET_NAME = 'Data';

// Lấy dữ liệu từ Google Sheets
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    // Bỏ qua header row
    const rows = data.slice(1);
    
    const result = rows.map((row, index) => ({
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
    
    const response = ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Set CORS headers manually
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    
    return response;
  } catch (error) {
    const response = ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
    
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    
    return response;
  }
}

// Lưu dữ liệu vào Google Sheets
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
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
    
    // Tạo status từ tất cả 5 ratings
    const allRatings = [
      data.ratings.communication || 1,
      data.ratings.pronunciation || 1,
      data.ratings.vocabulary || 1,
      data.ratings.listening || 1,
      data.ratings.reading || 1
    ];
    const statusText = allRatings.map(rating => getStatusValue(rating)).join(', ');
    
    const values = [
      data.studentName,
      data.classCode,
      data.teacherName,
      data.level,
      statusText,
      getCriteriaValue(data.ratings.communication || 1),
      getCriteriaValue(data.ratings.pronunciation || 1),
      getCriteriaValue(data.ratings.vocabulary || 1),
      getCriteriaValue(data.ratings.listening || 1),
      getCriteriaValue(data.ratings.reading || 1),
      new Date().toISOString()
    ];
    
    sheet.appendRow(values);
    
    const response = ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Set CORS headers manually
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    
    return response;
  } catch (error) {
    const response = ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
    
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    
    return response;
  }
}

// Xử lý OPTIONS request cho CORS
function doOptions(e) {
  const response = ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
  
  response.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  
  return response;
}
```

## 🚀 **Bước 3: Deploy Apps Script**

1. **Deploy:**
   - Click "Deploy" > "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"

2. **Lấy URL:**
   - Copy URL được tạo (dạng: `https://script.google.com/macros/s/.../exec`)
   - URL này sẽ là API endpoint của bạn

## 🔧 **Bước 4: Cập nhật Frontend**

Thay thế `src/services/googleSheetsService.js`:

```javascript
// Cấu hình Google Apps Script API
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE'; // Thay bằng URL từ bước 3

class GoogleSheetsService {
  constructor() {
    this.apiUrl = APPS_SCRIPT_URL;
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
```

## 📋 **Bước 5: Cập nhật config.js**

```javascript
// Cấu hình Google Apps Script API
export const GOOGLE_SHEETS_CONFIG = {
  // Google Apps Script URL (thay bằng URL từ bước 3)
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  
  // Tên các sheet trong file Google Sheets
  SHEETS: {
    DATA: 'Data' // Sheet chứa dữ liệu đánh giá
  }
};
```

## ✅ **Ưu điểm của Google Apps Script:**

1. **Không cần OAuth 2.0** - Apps Script tự động có quyền truy cập
2. **Không cần API Key** - Hoàn toàn miễn phí
3. **Không có CSP issues** - Không cần cấu hình Content Security Policy
4. **Đơn giản hơn** - Chỉ cần fetch() thông thường
5. **Ổn định hơn** - Không phụ thuộc vào Google API client

## 🎯 **Kết quả:**

- ✅ Không còn lỗi OAuth 2.0
- ✅ Không còn CSP violations  
- ✅ Không cần popup đăng nhập
- ✅ Dữ liệu được lưu trực tiếp vào Google Sheets
- ✅ Ứng dụng hoạt động ổn định

**🎉 Google Apps Script là giải pháp tốt nhất cho trường hợp này!**
