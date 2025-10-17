# Hướng dẫn cấu hình Google Sheets

## 1. Tạo Google Sheets

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một file mới với tên "Danh gia hoc thu"
3. Tạo 1 sheet:
   - **Sheet 1**: Đặt tên là "Data" (Dữ liệu đánh giá)

## 2. Cấu trúc Sheet "Data"

| A (name) | B (classID) | C (nameTeacher) | D (level) | E (status) | F (Tiêu chí 1) | G (Tiêu chí 2) | H (Tiêu chí 3) | I (Tiêu chí 4) | J (Tiêu chí 5) | K (date) |
|----------|-------------|-----------------|-----------|------------|----------------|----------------|----------------|----------------|----------------|----------|
| Nguyễn Văn A | CLASS001 | Trần Thị B | I | Rất hạn chế | Học viên còn rụt rè... | Học viên còn rụt rè... | Học viên còn rụt rè... | Học viên còn rụt rè... | Học viên còn rụt rè... | 2024-01-15 |

### 3. Giá trị Status (Cột E):
- **1**: Rất hạn chế
- **2**: Yếu  
- **3**: Trung bình
- **4**: Tốt
- **5**: Rất tốt/Tiềm năng cao

### 4. Giá trị Tiêu chí (Cột F-J):
- **1**: "Học viên còn rụt rè, chưa tương tác nhiều với giáo viên, cần hỗ trợ và khơi gợi thêm"
- **2**: "Học viên có một số tương tác cơ bản nhưng còn hạn chế, cần khuyến khích thêm"
- **3**: "Học viên tương tác ở mức trung bình, có thể cải thiện thêm"
- **4**: "Học viên tương tác tốt, có sự tiến bộ rõ rệt"
- **5**: "Học viên tương tác xuất sắc, có tiềm năng cao"

## 4. Lấy Google Sheets ID

1. Mở file Google Sheets
2. Copy ID từ URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Ví dụ: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 5. Tạo Google API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Sheets API:
   - Vào "APIs & Services" > "Library"
   - Tìm "Google Sheets API" và bật
4. Tạo API Key:
   - Vào "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy API Key

## 6. Cấu hình quyền truy cập

1. Mở file Google Sheets
2. Click "Share" (Chia sẻ)
3. Thêm email của Google Cloud project
4. Cấp quyền "Editor"

## 7. Cập nhật file config.js

Mở file `src/config.js` và cập nhật:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID', // Thay bằng ID thực tế
  API_KEY: 'YOUR_GOOGLE_API_KEY',   // Thay bằng API Key thực tế
  // ... các cấu hình khác
};
```

## 8. Kiểm tra kết nối

1. Chạy ứng dụng: `npm run dev`
2. Kiểm tra thông báo kết nối ở đầu trang
3. Nếu thành công, sẽ hiển thị số lượng lớp chưa đánh giá

## 9. Xử lý lỗi thường gặp

### Lỗi 403 Forbidden
- Kiểm tra API Key có đúng không
- Kiểm tra Google Sheets API đã được bật chưa
- Kiểm tra quyền truy cập file

### Lỗi 404 Not Found
- Kiểm tra Sheet ID có đúng không
- Kiểm tra tên sheet có đúng không (Classes, Evaluations)

### Lỗi CORS
- Đảm bảo domain được thêm vào Google Cloud Console
- Kiểm tra cấu hình CORS trong project

## 10. Bảo mật

⚠️ **Lưu ý quan trọng:**
- Không commit API Key vào Git
- Sử dụng biến môi trường cho production
- Giới hạn quyền truy cập API Key
- Thường xuyên kiểm tra và cập nhật API Key
