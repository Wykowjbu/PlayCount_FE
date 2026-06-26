### Task 9: Owner Workspace - KYC & Settings

**Files:**
- Create: `src/app/owner/onboarding/page.tsx`, `src/app/owner/venues/page.tsx`, `src/app/owner/pricing/page.tsx`

**Interfaces:**
- Consumes: API backend `/api/Venues`, `/api/courts`, `/api/pricing-rules`.
- Produces: Các form đăng ký thông tin KYC chủ sân, quản lý thông tin sân và cấu hình bảng giá.

- [ ] **Step 1: Viết test cho PricingRule overlap check**
  Tạo `tests/pricing-rules.test.tsx` kiểm tra logic validate trùng lặp khung giờ trên form UI. Verify FAIL.

- [ ] **Step 2: Xây dựng form KYC Onboarding**
  Trong `src/app/owner/onboarding/page.tsx`:
  - Đăng ký doanh nghiệp, người đại diện, tải ảnh giấy phép (có thanh tiến trình tải lên).
  - Hiển thị các trạng thái KYC (Draft, Submitted, NeedsAction, Verified) kèm thông tin cảnh báo nếu bị reject.

- [ ] **Step 3: Xây dựng trang Quản lý địa điểm & Sân**
  Trong `src/app/owner/venues/page.tsx`:
  - Form chỉnh sửa thông tin sân (tên, mô tả, môn thể thao ToggleGroup, tiện ích checkbox).
  - Quản lý danh sách sân (Courts list), Switch bật/tắt hoạt động, nút Add Court mở Dialog.

- [ ] **Step 4: Xây dựng PricingRule Builder**
  Trong `src/app/owner/pricing/page.tsx`:
  - Thiết lập giá: Chọn ngày trong tuần (ToggleGroup multiple), khoảng thời gian (Start/End time picker), mức giá và thứ tự ưu tiên (Priority).
  - Hiển thị bảng tổng hợp giá tuần để chủ sân kiểm tra trực quan các khung giờ trùng lặp.

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/owner/onboarding src/app/owner/venues src/app/owner/pricing tests/pricing-rules.test.tsx
  git commit -m "feat: implement Owner KYC, Venue edit and PricingRule Builder"
  ```
