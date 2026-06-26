### Task 5: Player Phase - Venue Detail & Court Slot Picker

**Files:**
- Create: `src/app/(public)/venues/[id]/page.tsx`, `src/components/playcourt/slot-picker.tsx`

**Interfaces:**
- Consumes: API client từ Task 4.
- Produces: Trang chi tiết sân thể thao và grid chọn giờ (slot picker).

- [ ] **Step 1: Viết test cho SlotPicker component**
  Tạo `tests/slot-picker.test.tsx` kiểm tra hành vi click chọn slot, block slot trùng giờ, và tính toán tổng số tiền dựa trên quy tắc giá. Verify FAIL.

- [ ] **Step 2: Tạo SlotPicker component**
  Tạo `src/components/playcourt/slot-picker.tsx`:
  - Lưới hiển thị các sân (Court A, Court B...) và các múi giờ từ 06:00 đến 22:00.
  - Các trạng thái ô giờ: trống (trắng, viền mảnh), hover (green-50), đã chọn (green-800, chữ trắng), bận (hairline-soft, text faint, có sọc chéo).
  - Thanh Selection summary bên dưới hiển thị thông tin sân chọn, giờ và tổng tiền kèm button "Tiếp tục".

- [ ] **Step 3: Xây dựng trang Venue Detail**
  Trong `src/app/(public)/venues/[id]/page.tsx`:
  - Phía trên là Gallery ảnh (MotionCarousel).
  - Layout chính: Cột trái gồm Thông tin chi tiết, Tiện ích, Chính sách hủy sân (Accordion), Đánh giá của khách. Cột phải là BookingPanel sticky chứa Sport selector, DatePicker và danh sách slot nhanh. Nhấn "Đặt lịch" cuộn xuống SlotPicker.

- [ ] **Step 4: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/(public)/venues/[id] src/components/playcourt/slot-picker.tsx tests/slot-picker.test.tsx
  git commit -m "feat: implement Venue Detail page and Court Slot Picker grid"
  ```
