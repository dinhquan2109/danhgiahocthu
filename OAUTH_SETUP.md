# 🔐 Hướng dẫn cấu hình OAuth 2.0 cho Google Sheets

## ✅ **Đã cấu hình OAuth 2.0**

Hệ thống đã được chuyển từ API Key sang OAuth 2.0 để bảo mật và ổn định hơn.

### **Thông tin OAuth 2.0:**
- **Client ID**: `1034144698153-qnh5747mmfku65u52s3mp3narrssbq8n.apps.googleusercontent.com`
- **Client Secret**: `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`

## 🚀 **Cách hoạt động:**

### **1. Lần đầu sử dụng:**
- Khi mở ứng dụng, sẽ xuất hiện popup đăng nhập Google
- Chọn tài khoản Google có quyền truy cập Google Sheets
- Cho phép ứng dụng truy cập Google Sheets

### **2. Các lần sau:**
- Tự động đăng nhập (không cần popup)
- Dữ liệu được lưu trực tiếp vào Google Sheets

## 🔧 **Cấu hình Google Cloud Console:**

### **1. Bật Google Sheets API:**
```
1. Vào Google Cloud Console
2. Chọn project của bạn
3. APIs & Services > Library
4. Tìm "Google Sheets API"
5. Click "Enable"
```

### **2. Cấu hình OAuth consent screen:**
```
1. APIs & Services > OAuth consent screen
2. Chọn "External" (hoặc "Internal" nếu trong organization)
3. Điền thông tin:
   - App name: "Đánh giá học thử"
   - User support email: email của bạn
   - Developer contact: email của bạn
4. Save and Continue
```

### **3. Tạo OAuth 2.0 credentials:**
```
1. APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "Đánh giá học thử OAuth"
5. Authorized JavaScript origins:
   - http://localhost:5173 (cho development)
   - https://yourdomain.com (cho production)
6. Click "Create"
7. Copy Client ID và Client Secret
```

## 📋 **Cấu trúc Google Sheets:**

### **Sheet: Data**
| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| name | classID | nameTeacher | level | status | criteria1 | criteria2 | criteria3 | criteria4 | criteria5 | date |

### **Header row (dòng 1):**
```
name | classID | nameTeacher | level | status | criteria1 | criteria2 | criteria3 | criteria4 | criteria5 | date
```

## 🎯 **Test ứng dụng:**

### **1. Chạy development:**
```bash
npm run dev
```

### **2. Kiểm tra:**
- ✅ Popup đăng nhập Google xuất hiện
- ✅ Đăng nhập thành công
- ✅ Trạng thái "✅ Đã kết nối Google Sheets"
- ✅ Có thể lưu dữ liệu vào Google Sheets

### **3. Kiểm tra Google Sheets:**
- Mở Google Sheets
- Kiểm tra dữ liệu được thêm vào sheet "Data"
- Dữ liệu có đúng format không

## 🔒 **Bảo mật:**

### **OAuth 2.0 vs API Key:**
- ✅ **OAuth 2.0**: An toàn, user kiểm soát quyền truy cập
- ❌ **API Key**: Có thể bị lạm dụng, khó kiểm soát

### **Quyền truy cập:**
- User có thể thu hồi quyền bất kỳ lúc nào
- Chỉ truy cập Google Sheets được phép
- Không lưu trữ thông tin nhạy cảm

## 🚨 **Troubleshooting:**

### **Lỗi "Access blocked":**
```
1. Kiểm tra OAuth consent screen
2. Thêm domain vào authorized origins
3. Publish app (nếu cần)
```

### **Lỗi "Invalid client":**
```
1. Kiểm tra Client ID và Client Secret
2. Kiểm tra authorized origins
3. Tạo lại credentials nếu cần
```

### **Popup bị chặn:**
```
1. Cho phép popup cho domain
2. Kiểm tra browser settings
3. Thử browser khác
```

## 📞 **Hỗ trợ:**

Nếu gặp vấn đề:
1. Kiểm tra console log
2. Kiểm tra Google Cloud Console
3. Kiểm tra Google Sheets permissions
4. Liên hệ support nếu cần

---

**🎉 OAuth 2.0 đã sẵn sàng! Hệ thống bây giờ an toàn và ổn định hơn.**
