# Khắc phục nhanh lỗi 401

## Vấn đề hiện tại:
- API Key có website restriction nhưng checkbox chưa được chọn
- Điều này gây ra lỗi 401 (Unauthorized)

## Giải pháp nhanh:

### Option 1: Bỏ restriction (Khuyến nghị)
1. Vào Google Cloud Console > APIs & Services > Credentials
2. Click vào API Key của bạn
3. Ở phần **Application restrictions**, chọn **"None"**
4. Click **"Save"**

### Option 2: Chọn checkbox website
1. Trong phần **Website restrictions**
2. **Chọn checkbox** bên cạnh `https://danhgiahocthu.vercel.app`
3. Click **"Save"**

### Option 3: Tạo API Key mới
1. Vào **APIs & Services** > **Credentials**
2. Click **"Create Credentials"** > **"API Key"**
3. Copy API Key mới
4. Cập nhật trong `src/config.js`:
   ```javascript
   API_KEY: 'YOUR_NEW_API_KEY_HERE'
   ```

## Test:
1. Chạy `npm run dev`
2. Kiểm tra console
3. Nếu thành công: "✅ Đã kết nối Google Sheets"
