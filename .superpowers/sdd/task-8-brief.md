### Task 8: Owner Workspace - Dashboard & Resource Calendar

**Files:**
- Create: `src/app/owner/dashboard/page.tsx`, `src/app/owner/calendar/page.tsx`, `src/components/owner/resource-calendar.tsx`

**Interfaces:**
- Produces: Bảng điều khiển doanh thu và lịch quản lý tài nguyên sân cho chủ sân.

- [ ] **Step 1: Viết test cho ResourceCalendar grid rendering**
  Tạo `tests/owner-calendar.test.tsx` kiểm tra hiển thị đúng các cột sân thể thao và định vị đúng vị trí thời gian của booking event. Verify FAIL.

- [ ] **Step 2: Xây dựng trang Owner Dashboard**
  Trong `src/app/owner/dashboard/page.tsx`:
  - 4 Thẻ chỉ số chính: Doanh thu, Đơn đặt, Tỷ lệ lấp đầy, Đang chờ duyệt.
  - Biểu đồ doanh thu dạng SVG thuần (không dùng thư viện ngoài).
  - Task danh sách công việc cần xử lý gấp (đơn đặt chờ tiền, yêu cầu hoàn tiền).

- [ ] **Step 3: Tạo ResourceCalendar component**
  Tạo `src/components/owner/resource-calendar.tsx`:
  - Trục ngang là các sân (Court A, Court B...), trục dọc là thời gian.
  - Event click mở Panel bên phải (Sheet) xem chi tiết và thao tác (hủy, cập nhật).
  - Click vào ô trống mở Popover tạo nhanh đơn đặt thủ công.

- [ ] **Step 4: Xây dựng trang Lịch sân chủ sân**
  Trong `src/app/owner/calendar/page.tsx`, import `ResourceCalendar` kèm bộ lọc nhanh theo môn thể thao, trạng thái và nút "+ Tạo booking".

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/owner/dashboard src/app/owner/calendar src/components/owner/resource-calendar.tsx tests/owner-calendar.test.tsx
  git commit -m "feat: complete Owner Dashboard and Resource Calendar view"
  ```
