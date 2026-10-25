# Notes — bài thực hành QA V-Intern

Ứng dụng ghi chú tổng hợp để nghiệm thu luồng nộp bài, không phải bài đánh giá của sinh viên thật.

## Chạy và kiểm thử

Node.js 22 trở lên. Chạy `npm ci`, `npx playwright install chromium`, rồi `npm test`. Chạy `npm run dev` để mở ứng dụng, `npm run build` để tạo bản build. Lưu ý cài browser vào cache thuộc thư mục dự án khi chạy trong workspace V-Intern.

Kiểm thử hiện tại xác nhận: tiêu đề rỗng/toàn khoảng trắng bị chặn; gửi form bằng bàn phím; sửa đúng ghi chú và giữ nguyên ghi chú khác. Kết quả của hệ thống trusted runner độc lập được lưu cùng SHA bài nộp, không lấy tập tin test do sinh viên viết làm bằng chứng duy nhất.

## Phạm vi từng nhiệm vụ

1. Danh sách và trình sửa, validation tiêu đề, thao tác bàn phím.
2. Lưu localStorage và khôi phục khi tải lại.
3. Tìm kiếm, lọc nhãn và xóa có xác nhận.
4. Xuất JSON có schemaVersion, kiểm thử và bàn giao.

PR đầu tiên đã cố ý tắt validation để kiểm tra cơ chế trả bài. PR sửa bật lại validation và bổ sung kiểm thử. Các PR tiếp theo mở rộng chức năng theo thứ tự; không coi chức năng chưa có ở bước đầu là đã hoàn thành.
