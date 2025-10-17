# Tạo API Key mới

## Bước 1: Tạo API Key mới
1. Vào [Google Cloud Console](https://console.cloud.google.com)
2. Chọn project của bạn
3. Vào **APIs & Services** > **Credentials**
4. Click **"Create Credentials"** > **"API Key"**
5. Copy API Key mới

## Bước 2: Cấu hình API Key
1. Click vào API Key vừa tạo
2. **Application restrictions**: Chọn **"None"**
3. **API restrictions**: Chọn **"Don't restrict key"**
4. Click **"Save"**

## Bước 3: Cập nhật code
Thay thế API Key trong file `src/config.js`:

```javascript
export const GOOGLE_SHEETS_CONFIG = {
  SHEET_ID: '1H-nLX-zMzoxGJAB2HV-bP6_cIiPInVlYz4zYjs0KiLw',
  API_KEY: 'YOUR_NEW_API_KEY_HERE', // Thay bằng API Key mới
  // ... rest of config
};
```

## Bước 4: Kiểm tra Google Sheets
1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/1H-nLX-zMzoxGJAB2HV-bP6_cIiPInVlYz4zYjs0KiLw/edit
2. Đảm bảo có sheet tên **"Data"**
3. Đảm bảo sheet được chia sẻ với quyền **"Editor"**

## Bước 5: Test
1. Chạy `npm run dev`
2. Kiểm tra console log
3. Nếu thành công: "✅ Đã kết nối Google Sheets"
