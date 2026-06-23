# Task 8 Report: Owner Workspace - Dashboard & Resource Calendar

## 1. Files Changed
### Created Files
- `src/components/owner/resource-calendar.tsx`: Thành phần lịch tài nguyên (Resource Calendar) hiển thị lưới thời gian dọc (06:00 - 22:00) và các sân theo trục ngang. Hỗ trợ hiển thị thẻ đặt sân (BookingEvent) ở vị trí chính xác (sử dụng định vị absolute tính theo phút), click vào thẻ để xem chi tiết, và click vào ô trống để tạo nhanh đơn đặt sân.
- `src/app/owner/dashboard/page.tsx`: Trang tổng quan (Dashboard) cho chủ sân gồm 4 thẻ chỉ số chính (Doanh thu, Đơn đặt, Tỷ lệ lấp đầy, Chờ xử lý gấp), biểu đồ xu hướng doanh thu dạng SVG thuần (không dùng thư viện biểu đồ bên ngoài) và danh sách công việc cần xử lý gấp (các booking cần duyệt hoặc hoàn tiền).
- `src/app/owner/page.tsx`: Trang redirect ở cấp độ `/owner` tự động điều hướng người dùng tới `/owner/dashboard`.
- `src/app/owner/calendar/page.tsx`: Trang quản lý lịch đặt sân của chủ sân tích hợp thành phần `ResourceCalendar`. Hỗ trợ bộ lọc nhanh theo môn thể thao, trạng thái đơn đặt sân, bộ chuyển đổi ngày (Hôm nay, Trước, Sau), panel chi tiết đơn đặt sân (xem thông tin, duyệt đơn, hủy đơn) và form tạo nhanh đặt sân thủ công trực quan.
- `tests/owner-calendar.test.tsx`: Bộ unit test hoàn chỉnh kiểm tra việc render các cột sân, hiển thị mốc giờ, vị trí booking, gọi hàm `onEventClick` và `onSlotClick`, logic clamping thời gian biên, và style theo trạng thái.

### Modified Files
- `package.json`: Cấu hình lại dependencies và devDependencies để đảm bảo độ ổn định của Vitest.
- `pnpm-lock.yaml`: Cập nhật cấu hình khóa dependency sau khi chuyển sang node-linker hoisted.

## 2. Self-Review Findings
- **Giải quyết triệt để lỗi môi trường**: Khắc phục lỗi ESM subpath import (`#module-sync-enabled` và `#module-evaluator`) trên Node.js v22 bằng cách cấu hình PNPM sử dụng `node-linker=hoisted` (cài đặt phẳng), tránh các symlinks phức tạp gây hiểu nhầm đường dẫn trong quá trình import của Vite/Vitest.
- **Thiết kế Grid linh hoạt**: Grid của `ResourceCalendar` chia cột theo số lượng sân đấu hiện có, định vị thẻ đặt sân tuyệt đối theo trục Y (top, height) dựa trên công thức quy đổi `startTime` và `endTime` thành số phút tính từ 06:00, giúp hiển thị mượt mà các suất đặt có thời lượng lẻ hoặc bắt đầu lẻ (ví dụ 1.5 tiếng, 2 tiếng, v.v.).
- **Tận dụng tốt Primitives**: Dashboard và Calendar tiêu thụ tốt các primitives dùng chung như `Button`, `Input` và `StatusBadge` để duy trì sự nhất quán của UI/UX theo đúng đặc tả Vercel theme.

## 3. Reviewer Feedback & Enhancements
Để hoàn thiện chất lượng UI/UX cũng như đảm bảo tính ổn định tối đa theo các góp ý từ reviewer, các cải tiến và sửa đổi sau đã được áp dụng đầy đủ:
- **Khắc phục lỗi import trong Calendar**: Nhập bổ sung biểu tượng `Clock` từ thư viện `lucide-react` để hiển thị trên giao diện thông tin thời gian mà không gây crash màn hình.
- **Sửa cú pháp SVG trong Dashboard**: Sửa thuộc tính `viewBox` của SVG biểu đồ từ cú pháp template literal bị lỗi thành chuỗi tĩnh `viewBox="0 0 500 160"` đồng thời chuẩn hóa các chuỗi biểu diễn toạ độ của thẻ `<path>` để tránh build error.
- **Bọc Tooltip Radix cho các nút**: Bọc toàn bộ các nút điều hướng lịch (Hôm nay, `<ChevronLeft>`, `<ChevronRight>`) và nút đóng chi tiết sự kiện bằng Radix Tooltip (`@radix-ui/react-tooltip`) cùng với thuộc tính `aria-label` mô tả rõ ràng để nâng cao khả năng tiếp cận (accessibility).
- **Phân biệt phong cách Booking theo trạng thái (Status-based Styling)**:
  * Nhóm thành công (`confirmed`, `paid`, `verified`): Hiển thị nền xanh lục nhạt, viền xanh lục đậm nổi bật.
  * Nhóm chờ duyệt (`pending`, `needs action`): Hiển thị nền vàng nhạt, viền vàng sậm cảnh báo nhẹ.
  * Nhóm thất bại/hủy/từ chối (`failed`, `rejected`, `cancelled`): Hiển thị nền xám nhạt, viền nét đứt (dashed), tiêu đề gạch ngang chữ và độ mờ opacity 75%.
- **Giới hạn thời gian (Timeline Clamping)**: Cài đặt logic clamping trong `ResourceCalendar` đảm bảo rằng nếu đơn đặt có thời gian bắt đầu trước 06:00 hoặc kết thúc sau 22:00, toạ độ render sẽ được ghim (clamp) khớp khít vào biên của lịch mà không bị render tràn ra ngoài cấu trúc lưới thời gian.
- **Sửa nền Tooltip SVG**: Vì CSS `bg-white` không có tác dụng trực tiếp trên thẻ `<text>` của SVG, một thẻ `<rect>` màu trắng đã được chèn vào ngay phía sau text tooltip hiển thị doanh thu trên biểu đồ doanh thu tuần nhằm đảm bảo chữ luôn hiển thị rõ ràng trên mọi nền.
- **Bổ sung Unit Tests**: Thêm 2 test cases mới trong `tests/owner-calendar.test.tsx` kiểm tra hoạt động của cơ chế clamping biên thời gian và tính chính xác của việc áp dụng CSS classes theo trạng thái booking.

## 4. Testing Evidence
Tất cả 33 test cases thuộc 4 test suites đều đã vượt qua thành công:
```
 RUN  v3.0.7 C:/Users/hantu/.gemini/antigravity-cli/brain/0121db2e-86e2-41dc-8664-757f7c0ea692/.system_generated/worktrees/subagent-Owner-Flow-Developer-self-ba232e1a

 ✓ tests/owner-calendar.test.tsx (7 tests) 271ms
 ✓ tests/providers.test.tsx (2 tests) 59ms
 ✓ tests/layouts.test.tsx (10 tests) 420ms
 ✓ tests/primitives.test.tsx (14 tests) 325ms

 Test Files  4 passed (4)
      Tests  33 passed (33)
   Start at  11:56:26
   Duration  4.09s (transform 382ms, setup 827ms, collect 3.74s, tests 1.07s, environment 7.21s, prepare 635ms)
```
