// Cấu hình Google Apps Script API
export const GOOGLE_SHEETS_CONFIG = {
  // Google Apps Script URL
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyT3wt4VlDCxzAmy0QdNPqe5gHbzVLgk6s6Wadi0wEuVld1VzKRSUT3B36zGgnF9Uxs/exec',
  
  // Tên các sheet trong file Google Sheets
  SHEETS: {
    DATA: 'Data' // Sheet chứa dữ liệu đánh giá
  },
  
  // Cấu trúc sheet Data
  DATA_COLUMNS: {
    NAME: 'A',           // Cột A: Tên học viên
    CLASS_ID: 'B',       // Cột B: Mã lớp
    NAME_TEACHER: 'C',   // Cột C: Tên giáo viên
    LEVEL: 'D',          // Cột D: Trình độ
    STATUS: 'E',         // Cột E: Trạng thái (1,2,3,4,5)
    CRITERIA_1: 'F',     // Cột F: Tiêu chí 1 (Giao tiếp & phản xạ)
    CRITERIA_2: 'G',     // Cột G: Tiêu chí 2 (Phát âm & ngữ pháp)
    CRITERIA_3: 'H',     // Cột H: Tiêu chí 3 (Từ vựng & cấu trúc)
    CRITERIA_4: 'I',     // Cột I: Tiêu chí 4 (Nghe hiểu)
    CRITERIA_5: 'J',     // Cột J: Tiêu chí 5 (Đọc hiểu)
    DATE: 'K'            // Cột K: Ngày đánh giá
  },
  
  // Mapping các tiêu chí với cột
  CRITERIA_MAPPING: {
    'communication': 'F',    // Giao tiếp & phản xạ
    'pronunciation': 'G',    // Phát âm & ngữ pháp
    'vocabulary': 'H',       // Từ vựng & cấu trúc
    'listening': 'I',        // Nghe hiểu
    'reading': 'J'          // Đọc hiểu
  }
};

// Cấu hình Supabase (nếu cần)
export const SUPABASE_CONFIG = {
  URL: 'YOUR_SUPABASE_URL',
  ANON_KEY: 'YOUR_SUPABASE_ANON_KEY'
};
