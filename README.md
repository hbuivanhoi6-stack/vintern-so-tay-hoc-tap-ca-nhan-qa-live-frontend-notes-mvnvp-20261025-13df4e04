# Notes — bài thực hành QA V-Intern

Ứng dụng ghi chú nhỏ dùng để kiểm tra toàn bộ chuỗi nộp PR, chạy bộ test độc lập, Agent nhận xét và giảng viên chốt điểm. Đây là dữ liệu QA tổng hợp, không phải kết quả của sinh viên thật.

## Chạy từ đầu

1. Dùng Node.js 22 trở lên, mở terminal tại folder repository.
2. Chạy `npm ci`, rồi `npx playwright install chromium` để chuẩn bị trình duyệt kiểm thử. Trong workspace V-Intern, dùng script project storage để mọi cache/browser nằm trong folder dự án.
3. Chạy `npm run dev`, mở địa chỉ Vite in trong terminal. Chọn New note, nhập Title/Content/Tags (các nhãn cách nhau bằng dấu phẩy), rồi Save. Enter ở nút Save cũng gửi form được.
4. Chạy `npm test` để kiểm tra sáu kịch bản bằng trình duyệt thật; `npm run build` để tạo bản build.

## Các chức năng

| Thao tác | Kết quả mong đợi |
|---|---|
| Tạo/sửa | Tiêu đề rỗng hoặc toàn khoảng trắng bị chặn; sửa đúng ghi chú, giữ id/ngày tạo |
| Tải lại trang | Đọc lại dữ liệu localStorage theo schemaVersion 1 |
| Search và tag | Tìm trong tên/nội dung/nhãn và lọc nhãn chính xác; hai bộ lọc kết hợp |
| Delete | Cancel giữ nguyên, xác nhận mới xóa và lưu lại |
| Export JSON | Tải notes-v1.json có schemaVersion và notes; preview cùng nội dung với tệp |
| Dữ liệu lỗi | JSON/schema hỏng không bị ghi đè; Save bị khóa, thông báo hướng dẫn giữ dữ liệu gốc |

## Kiểm thử và giới hạn

Sáu test bao phủ validation, bàn phím/sửa đúng ghi chú, khôi phục sau reload, lọc/xóa có xác nhận, tệp export thực và bảo toàn dữ liệu hỏng. Bộ trusted runner của V-Intern là bằng chứng riêng, gắn task/spec/SHA và không lấy test do sinh viên viết làm bằng chứng duy nhất.

Ứng dụng chạy trên một trình duyệt, không có tài khoản hoặc đồng bộ nhiều thiết bị. Nếu storage đầy/không khả dụng, bản nháp trong editor được giữ và lỗi được báo. Dữ liệu localStorage là văn bản thuần; không lưu thông tin nhạy cảm. README và tests nằm trong PR bàn giao; lockfile kế thừa từ phần chuẩn bị trước đó.
