# Hệ thống đánh giá học thử

Hệ thống quản lý đánh giá học thử cho giáo viên với tích hợp Supabase và Google Sheets.

## Tính năng

- 🔐 **Xác thực Supabase**: Đăng nhập/đăng ký giáo viên
- 📊 **Tích hợp Google Sheets**: Đọc danh sách lớp và lưu dữ liệu đánh giá
- 📝 **Form đánh giá**: Giao diện thân thiện để đánh giá học sinh
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
- 🔄 **Đồng bộ dữ liệu**: Tự động cập nhật trạng thái lớp

## Cài đặt

### 1. Cấu hình Supabase

1. Tạo tài khoản tại [Supabase](https://supabase.com)
2. Tạo project mới
3. Vào Settings > API để lấy URL và anon key
4. Cập nhật file `config.js`:

```javascript
SUPABASE: {
    URL: 'YOUR_SUPABASE_URL', // Thay bằng URL của bạn
    ANON_KEY: 'YOUR_SUPABASE_ANON_KEY' // Thay bằng anon key của bạn
}
```

### 2. Cấu hình Google Sheets

1. Tạo Google Sheets mới với 2 sheet:
   - **Classes**: Chứa thông tin lớp học
   - **Evaluations**: Chứa dữ liệu đánh giá

2. Cấu trúc sheet **Classes** (A1:E):
```
| Tên lớp | Giáo viên | Lịch học | Trạng thái | Số học sinh |
|---------|-----------|----------|------------|-------------|
| Lớp A1  | Nguyễn A   | T2,4,6   | pending    | 15          |
| Lớp B1  | Trần B     | T3,5,7   | pending    | 12          |
```

3. Cấu trúc sheet **Evaluations** (A1:N):
```
| Thời gian | Tên lớp | Ngày đánh giá | Tên học sinh | Tuổi | Tên phụ huynh | SĐT | Ghi chú | Điểm tham gia | Điểm hiểu bài | Điểm tổng thể | Đánh giá | Khuyến nghị | Giáo viên |
```

4. Lấy Google Sheets ID từ URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

5. Cập nhật file `config.js`:
```javascript
GOOGLE_SHEETS: {
    SPREADSHEET_ID: 'YOUR_GOOGLE_SHEETS_ID', // Thay bằng ID của bạn
    // ... các cấu hình khác
}
```

### 3. Cấu hình Google API

1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google Sheets API
4. Tạo API key
5. Cập nhật file `config.js`:

```javascript
// Trong hàm initializeGoogleAPI()
await gapi.client.init({
    apiKey: 'YOUR_GOOGLE_API_KEY', // Thay bằng API key của bạn
    discoveryDocs: [GOOGLE_API_CONFIG.DISCOVERY_DOC]
});
```

### 4. Chạy ứng dụng

1. Mở file `index.html` trong trình duyệt
2. Hoặc sử dụng local server:

```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server
```

## Sử dụng

### Đăng ký/Đăng nhập
1. Mở ứng dụng
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Xác thực email (nếu cần)

### Đánh giá học thử
1. Xem danh sách lớp chưa đánh giá
2. Chọn lớp cần đánh giá
3. Điền form đánh giá đầy đủ
4. Lưu đánh giá

### Quản lý dữ liệu
- Dữ liệu được lưu tự động vào Google Sheets
- Trạng thái lớp được cập nhật sau khi đánh giá
- Có thể xem lại lịch sử đánh giá trong sheet

## Cấu trúc dự án

```
danhgiahocthu/
├── index.html          # Giao diện chính
├── styles.css          # CSS tùy chỉnh
├── config.js           # Cấu hình Supabase và Google Sheets
├── app.js              # Logic ứng dụng
├── README.md           # Hướng dẫn
└── .gitignore          # Git ignore
```

## Troubleshooting

### Lỗi kết nối Supabase
- Kiểm tra URL và anon key
- Đảm bảo project đã được tạo và active

### Lỗi Google Sheets
- Kiểm tra Google Sheets ID
- Đảm bảo API key có quyền truy cập
- Kiểm tra cấu trúc sheet có đúng không

### Lỗi xác thực
- Đảm bảo đã đăng nhập Google
- Kiểm tra quyền truy cập Google Sheets

## Hỗ trợ

Nếu gặp vấn đề, vui lòng kiểm tra:
1. Console log trong trình duyệt (F12)
2. Cấu hình trong file `config.js`
3. Quyền truy cập Google Sheets
4. Kết nối internet

## Phiên bản

- **v1.0.0**: Phiên bản đầu tiên với đầy đủ tính năng cơ bản
