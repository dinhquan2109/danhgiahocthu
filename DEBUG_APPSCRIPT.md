# 🔍 Debug Google Apps Script

## ❌ **Vấn đề hiện tại:**
- Apps Script vẫn trả về giá trị trung bình thay vì tất cả 5 ratings
- Timestamp chưa có thời gian cụ thể (giờ:phút:giây)

## 🔧 **Các bước kiểm tra:**

### **1. Kiểm tra Apps Script có được deploy đúng không:**

1. **Vào [script.google.com](https://script.google.com)**
2. **Mở project "Đánh giá học thử API"**
3. **Kiểm tra code trong `Code.gs` có đúng không:**
   ```javascript
   // Phải có dòng này:
   const statusText = allRatings.map(rating => getStatusValue(rating)).join(', ');
   
   // Và dòng này:
   new Date().toISOString()
   ```

### **2. Test Apps Script trực tiếp:**

1. **Trong Apps Script editor:**
   - Click **"Run"** trên function `doPost`
   - Hoặc test với URL: `https://script.google.com/macros/s/AKfycbyT3wt4VlDCxzAmy0QdNPqe5gHbzVLgk6s6Wadi0wEuVld1VzKRSUT3B36zGgnF9Uxs/exec`

2. **Test với Postman hoặc curl:**
   ```bash
   curl -X POST https://script.google.com/macros/s/AKfycbyT3wt4VlDCxzAmy0QdNPqe5gHbzVLgk6s6Wadi0wEuVld1VzKRSUT3B36zGgnF9Uxs/exec \
   -H "Content-Type: application/json" \
   -d '{
     "studentName": "Test",
     "classCode": "TEST001",
     "teacherName": "Test Teacher",
     "level": "I",
     "ratings": {
       "communication": 3,
       "pronunciation": 4,
       "vocabulary": 2,
       "listening": 5,
       "reading": 1
     }
   }'
   ```

### **3. Kiểm tra Google Sheets:**

1. **Mở Google Sheet:** `1H-nLX-zMzoxGJAB2HV-bP6_cIiPInVlYz4zYjs0KiLw`
2. **Kiểm tra sheet "Data"**
3. **Xem cột E (status):** Phải hiển thị: `"Trung bình, Tốt, Yếu, Rất tốt/Tiềm năng cao, Rất hạn chế"`
4. **Xem cột K (date):** Phải hiển thị: `"2023-12-21T10:30:45.123Z"`

### **4. Nếu vẫn không hoạt động:**

**Cách 1: Tạo deployment mới:**
1. **Deploy > Manage deployments**
2. **Delete deployment cũ**
3. **Deploy > New deployment**
4. **Type: "Web app"**
5. **Execute as: "Me"**
6. **Who has access: "Anyone"**
7. **Click "Deploy"**

**Cách 2: Kiểm tra permissions:**
1. **Apps Script > Project Settings**
2. **Enable "Show 'appsscript.json' manifest file in editor"**
3. **Kiểm tra file `appsscript.json`**

### **5. Debug code trong Apps Script:**

Thêm logging để debug:
```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Debug logging
    console.log('Received data:', data);
    console.log('Ratings:', data.ratings);
    
    const allRatings = [
      data.ratings.communication || 1,
      data.ratings.pronunciation || 1,
      data.ratings.vocabulary || 1,
      data.ratings.listening || 1,
      data.ratings.reading || 1
    ];
    
    console.log('All ratings:', allRatings);
    
    const statusText = allRatings.map(rating => getStatusValue(rating)).join(', ');
    console.log('Status text:', statusText);
    
    const timestamp = new Date().toISOString();
    console.log('Timestamp:', timestamp);
    
    // ... rest of code
  } catch (error) {
    console.error('Error:', error);
    // ... error handling
  }
}
```

## 🚀 **Các bước thực hiện:**

1. **Kiểm tra code trong Apps Script**
2. **Test trực tiếp với Postman/curl**
3. **Kiểm tra Google Sheets**
4. **Nếu cần, tạo deployment mới**
5. **Thêm debug logging**

## 📋 **Kết quả mong đợi:**

- **Status:** `"Trung bình, Tốt, Yếu, Rất tốt/Tiềm năng cao, Rất hạn chế"`
- **Timestamp:** `"2023-12-21T10:30:45.123Z"`
