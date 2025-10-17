# Phiếu đánh giá học thử

Ứng dụng React đánh giá học thử với giao diện đẹp và chức năng đầy đủ.

## 🚀 Tính năng

- 📝 **Form đánh giá chi tiết**: Đánh giá học viên theo nhiều tiêu chí
- 🎯 **3 trình độ khác nhau**: Cho người mới bắt đầu, có nền tảng, và giao tiếp
- ⭐ **Hệ thống chấm điểm 1-5**: Với mô tả chi tiết cho từng mức độ
- 💾 **Lưu trữ local**: Dữ liệu được lưu trong localStorage
- 🎨 **Giao diện đẹp**: Thiết kế hiện đại với gradient và animation
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🛠️ Cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy development server

```bash
npm run dev
```

### Build cho production

```bash
npm run build
```

## 📁 Cấu trúc dự án

```
src/
├── App.jsx              # Component chính
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Công nghệ sử dụng

- **React 18**: Framework chính
- **Vite**: Build tool nhanh
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library
- **LocalStorage**: Lưu trữ dữ liệu

## 🚀 Deploy lên GitHub Pages

1. Push code lên GitHub repository
2. GitHub Actions sẽ tự động build và deploy
3. Truy cập: `https://[username].github.io/[repository-name]`

## 📝 Sử dụng

1. **Nhập thông tin học viên**: Họ tên, mã lớp, tên giáo viên
2. **Chọn trình độ**: I, II, hoặc III
3. **Đánh giá chi tiết**: Click vào các nút số để chọn mức độ
4. **Xem mô tả**: Modal hiển thị mô tả chi tiết cho từng mức độ
5. **Lưu đánh giá**: Click "GỬI ĐÁNH GIÁ" để lưu

## 🔧 Customization

### Thay đổi tiêu chí đánh giá
Chỉnh sửa object `evaluationData` trong `src/App.jsx`

### Thay đổi màu sắc
Chỉnh sửa các class Tailwind CSS trong component

### Thêm tính năng mới
- Export dữ liệu
- Import/Export file
- Thống kê đánh giá

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.
