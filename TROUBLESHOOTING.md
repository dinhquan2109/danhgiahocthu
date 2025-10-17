# Khắc phục lỗi Google Sheets API

## Lỗi 401 (Unauthorized)

### Nguyên nhân:
- API Key không có quyền truy cập
- Google Sheets chưa được chia sẻ
- Google Sheets API chưa được bật

### Cách khắc phục:

#### 1. Bật Google Sheets API
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Chọn project
3. Vào **APIs & Services** > **Library**
4. Tìm **"Google Sheets API"** và click **ENABLE**

#### 2. Cấu hình quyền truy cập
1. Mở Google Sheets: `https://docs.google.com/spreadsheets/d/1H-nLX-zMzoxGJAB2HV-bP6_cIiPInVlYz4zYjs0KiLw/edit`
2. Click **Share** (Chia sẻ)
3. Thêm email hoặc chọn **"Anyone with the link"**
4. Cấp quyền **"Editor"**

#### 3. Tạo sheet "Data"
1. Trong Google Sheets, tạo sheet mới tên **"Data"**
2. Tạo header row:
   ```
   A: name | B: classID | C: nameTeacher | D: level | E: status | F: criteria1 | G: criteria2 | H: criteria3 | I: criteria4 | J: criteria5 | K: date
   ```

#### 4. Kiểm tra API Key
1. Vào **APIs & Services** > **Credentials**
2. Click vào API Key
3. Kiểm tra **Application restrictions**:
   - Nếu có **HTTP referrers**, thêm domain của bạn
   - Hoặc chọn **None** để test

#### 5. Tạo API Key mới (nếu cần)
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key mới
4. Cập nhật trong `src/config.js`

### Test kết nối:
1. Chạy ứng dụng: `npm run dev`
2. Kiểm tra console log
3. Nếu thành công, sẽ thấy "✅ Đã kết nối Google Sheets"

### Lỗi thường gặp:
- **403 Forbidden**: API Key không có quyền
- **404 Not Found**: Sheet ID sai hoặc sheet không tồn tại
- **400 Bad Request**: Cấu trúc dữ liệu sai
