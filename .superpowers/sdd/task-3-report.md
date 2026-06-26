# Task 3: Shared Business Components & Primitives - TDD Progress Report

## Trạng thái kiểm thử ban đầu (Failing Tests Verified)
- Đã tạo file unit tests: `tests/primitives.test.tsx`
- Kết quả chạy test ban đầu:
  - **Tổng số test cases**: 12
  - **Thất bại (Failed)**: 11
  - **Thành công (Passed)**: 1

## Quá trình triển khai
1. **Button Component (`src/components/playcourt/button.tsx`)**:
   - Triển khai đầy đủ các variant: `MarketingPrimary`, `AppPrimary`, `CommitPrimary`, `Secondary`, `Danger`.
   - Sử dụng `motion/react` (Framer Motion v12) để xây dựng hiệu ứng Ripple chất lượng cao khi người dùng click vào button `CommitPrimary`.
   
2. **Input Component (`src/components/playcourt/input.tsx`)**:
   - Bọc native `<input>` kèm theo wrapper label tùy chỉnh.
   - Thêm trạng thái focus green ring theo token (`focus-visible:ring-[var(--pc-green-600)]`).
   - Tích hợp trạng thái lỗi (error borders) và hỗ trợ aria attributes (`aria-describedby` trỏ tới error message, `aria-invalid`) để cải thiện tính dễ tiếp cận (accessibility).
   - Hỗ trợ đầy đủ `forwardRef` để tích hợp tốt với React Hook Form.

3. **StatusBadge Component (`src/components/playcourt/status-badge.tsx`)**:
   - Trực quan hóa các trạng thái nghiệp vụ bằng cách ánh xạ chúng vào CSS variables token màu sắc:
     - `confirmed` / `paid` / `verified`: Nền `green-100`, chữ `green-900`.
     - `pending` / `needs action`: Nền warning-soft, chữ warning-deep.
     - `failed` / `rejected` / `cancelled`: Nền `#fee2e2`, chữ error-deep.
     - `draft` / `completed`: Nền hairline-soft, chữ body.

4. **VenueCard Component (`src/components/playcourt/venue-card.tsx`)**:
   - Hiển thị thông tin tóm tắt của sân thể thao.
   - Sử dụng layout ảnh tỉ lệ 16:9 với hiệu ứng hover scale mượt mà.
   - Hiển thị nhãn thể thao mono-eyebrow, điểm đánh giá trung bình kèm icon star.
   - Hiển thị suất chơi trống tiếp theo dạng badge mềm (`green-50`) và tích hợp button "Xem lịch" dạng outline.

5. **MatchCard Component (`src/components/playcourt/match-card.tsx`)**:
   - Hiển thị thông tin matchmaking của trận đấu: tiêu đề, môn thể thao, ngày giờ cụ thể.
   - Tích hợp component phụ `AvatarGroup` xếp chồng để hiển thị trực quan những người chơi tham gia kèm fallback ký tự đầu tiên nếu thiếu ảnh.
   - Tích hợp `StatusBadge` để hiển thị trạng thái của trận đấu.

## Kết quả kiểm thử cuối cùng (Vitest Run Result)
- Đã bổ sung thêm unit tests cho cả `VenueCard` và `MatchCard` vào `tests/primitives.test.tsx` nâng tổng số test cases của suite primitives lên 14.
- Chạy toàn bộ test suite dự án (`npx vitest run`):
  - **primitives.test.tsx**: 14/14 tests PASS.
  - **providers.test.tsx**: 2/2 tests PASS.
  - **layouts.test.tsx**: 4/4 tests PASS.
  - **TỔNG CỘNG**: 20/20 tests PASS thành công 100%!

Tất cả các business components & primitives đều hoạt động đúng đặc tả thiết kế và kiểm thử.

## Cập nhật & Chỉnh sửa (Fix Report) - 2026-06-23
Dựa trên phản hồi "Needs fixes" từ phía reviewer, các chỉnh sửa sau đã được thực hiện và xác minh thành công:
1. **Card Border Radius**:
   - Cập nhật wrapper card trong `src/components/playcourt/venue-card.tsx` từ `rounded-[6px]` thành `rounded-[12px]`.
   - Cập nhật wrapper card trong `src/components/playcourt/match-card.tsx` từ `rounded-[6px]` thành `rounded-[12px]`.
2. **onClick Handler Cleanup**:
   - Loại bỏ hàm trung gian dư thừa `handleClick` trong `src/components/playcourt/button.tsx`. Truyền trực tiếp `onClick` prop nhận từ ButtonProps vào thẻ native `<button>`.
3. **StatusBadge Tests**:
   - Cập nhật `tests/primitives.test.tsx` trong test case `renders soft badge for draft, completed statuses` để chạy test cụ thể, tường minh cho cả hai trạng thái `draft` và `completed` (rerender và kiểm tra className thích hợp).

### Kết quả chạy lại toàn bộ test suite sau sửa đổi:
- **TỔNG CỘNG**: 26/26 tests PASS thành công 100%!
- **Commit mới**: `49e592a` (*feat: align card border radius and clean up primitives*)

