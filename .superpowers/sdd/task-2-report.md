# Task 2 Report: Global Layout Shell (Header & Navigation)

## Files Changed
- `src/components/layouts/player-header.tsx`: Header desktop có logo, navigation links, search, notifications list, và user profile dropdown menu.
- `src/components/layouts/player-mobile-nav.tsx`: Bottom navigation bar dành cho mobile, gồm các tabs và nút action "+" chính giữa mở action sheet để đặt sân hoặc tạo trận.
- `src/components/layouts/owner-sidebar.tsx`: Sidebar dành cho chủ sân (Owner) có thể thu gọn/mở rộng, hỗ trợ chọn venue địa điểm quản lý qua select dropdown.
- `src/components/layouts/layout-wrapper.tsx`: Component wrapper động ở client-side giúp tự động chuyển đổi giữa Player layout và Pro Owner/Admin layout dựa trên route bắt đầu bằng `/owner` hoặc `/admin`.
- `src/app/layout.tsx`: Tích hợp `LayoutWrapper` để bao bọc toàn bộ children của Next.js ứng dụng.
- `tests/layouts.test.tsx`: Bộ test suite gồm 10 unit tests kiểm tra cấu trúc HTML semantic (header, nav, aside), testid định vị, mock navigation, và sự chuyển đổi layout chính xác của `LayoutWrapper`.

## Testing Evidence
Chạy test suite thành công qua Vitest:
```bash
npx vitest run
```
Kết quả output:
```
 RUN  v4.1.9 D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE

 ✓ tests/layouts.test.tsx (10 tests) 371ms
 ✓ tests/providers.test.tsx (2 tests) 39ms

 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  23:15:34
   Duration  3.96s (transform 292ms, setup 580ms, import 1.96s, tests 410ms, environment 4.02s)
```

## Self-Review Findings
1. **Design Tokens & Theme Accents**: Sử dụng chính xác các biến CSS custom từ `tokens.css` như `var(--pc-green-800)`, `var(--pc-tennis)`, `var(--pc-canvas)`, `var(--pc-surface)`.
2. **Next.js App Router Integration**: Root Layout vẫn giữ nguyên cấu trúc Server Component nhằm đảm bảo SEO (metadata). Việc chuyển đổi layout theo route được ủy quyền thông qua Client Component wrapper `LayoutWrapper` sử dụng `usePathname()`, giúp giải quyết mâu thuẫn hoàn hảo.
3. **Interactive Components**: Các dropdown menu (avatar), notification list (popover) và mobile action sheet (overlay) đều được thiết kế tối giản, sạch sẽ bằng các state React và các transition class Tailwind CSS, hoạt động tốt trong cả jsdom environment của Vitest mà không bị lỗi thư viện animation.
4. **Icons Compatibility**: Thay thế một số icons mới hơn bằng các icons cũ/tương đương từ `lucide-react` để đảm bảo tương thích 100% với phiên bản `1.21.0` có sẵn trong dự án.

## Fixes and Refactor (Critical & Important Issues)

Để giải quyết các vấn đề về Code Quality và Spec Compliance, các chỉnh sửa sau đã được thực hiện và commit thành công:

### 1. Radix UI Integration (Critical)
- Thay thế các dropdown, popover và mobile sheet sử dụng React state trơn trước đây bằng các Radix UI primitives:
  - `@radix-ui/react-dropdown-menu` cho Menu tài khoản ở `player-header.tsx`.
  - `@radix-ui/react-popover` cho Popover Thông báo ở `player-header.tsx`.
  - `@radix-ui/react-dialog` cho Mobile Quick Action Sheet ở `player-mobile-nav.tsx`.
  - `@radix-ui/react-tooltip` cho các Tooltips.

### 2. Tooltips on Icon-Only Controls (Critical)
- Đã bọc các nút chỉ có icon (Tìm kiếm, Thông báo và nút hành động "+" trung tâm trên mobile) trong `<Tooltip.Root>` kèm các nhãn `aria-label` tương ứng.

### 3. Active Link Color (Critical)
- Chuyển màu gạch chân của active link trong `player-header.tsx` từ màu xanh đậm cũ sang màu xanh tennis thương hiệu: `bg-[var(--pc-tennis)]`.

### 4. Font Family for Eyebrows & Labels (Important)
- Áp dụng class `font-mono` cho các labels kỹ thuật và captions trong `owner-sidebar.tsx` và `player-header.tsx`:
  - Nhãn `"Địa điểm quản lý"` và caption `"Owner Dashboard"` trong `owner-sidebar.tsx`.
  - Nhãn `"Tài khoản"` và thời gian trong danh sách thông báo (`notif.time`) trong `player-header.tsx`.
  - Đồng thời bổ sung `font-mono` cho các description text phụ trên mobile nav sheet.

### 5. Border Radius & Shadows (Important)
- Đổi radius các card dropdown/popover thành `rounded-2xl` (16px).
- Đổi radius các input/controls (như select dropdown venue, các menu items, các icon container) thành `rounded-md` (6px).
- Thay thế bóng đổ nặng (`shadow-lg`, `shadow-2xl`) bằng floating shadow tinh tế: `shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)]`.

### 6. Verification Results
- Chạy lại toàn bộ test suite layout thành công (`tests/layouts.test.tsx` và `tests/providers.test.tsx` đều pass 100%).
- Đã build thành công dự án bằng Next.js (Turbopack) mà không phát sinh lỗi TypeScript hay biên dịch nào.

## Commit Information
- SHA: `367aeb6`
- Subject: `fix: refactor layout components with Radix UI, tooltips, active link color, and font adjustments`

---

## Fix Subagent Update (Layout Remaining Issues)

Chúng tôi đã giải quyết thành công các vấn đề layout còn sót lại trong Task 2 bao gồm:

### 1. Thêm Tooltip cho nút Đóng (Close Button) của Quick Action Sheet
- **Vấn đề**: Trong [player-mobile-nav.tsx](file:///D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE/src/components/layouts/player-mobile-nav.tsx), nút đóng (chứa icon `X`) chưa được bọc Radix Tooltip, vi phạm quy định "Mỗi điều khiển chỉ có icon phải có một Tooltip".
- **Chỉnh sửa**: Đã bọc nút đóng bằng `Tooltip.Root` cùng với Tooltip content là `"Đóng"`.

### 2. Thêm Tooltip cho nút Thu nhỏ/Mở rộng Sidebar (Sidebar Toggle Button)
- **Vấn đề**: Trong [owner-sidebar.tsx](file:///D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE/src/components/layouts/owner-sidebar.tsx), nút thu nhỏ/mở rộng sidebar (chứa icon Chevron) chưa được bọc Radix Tooltip.
- **Chỉnh sửa**: Đã bọc nút này bằng `Tooltip.Root` sử dụng `Tooltip.Provider` và hiển thị Tooltip content động: `"Thu nhỏ menu"` / `"Mở rộng menu"` dựa trên trạng thái `isCollapsed` hiện tại.

### 3. Cải thiện Accessibility & Styling cho nút Thêm mới nhanh (+) trên Mobile Nav
- **Vấn đề**: Nút hành động trung tâm trên mobile nav sử dụng `aria-label="+"` (cần một tên mang tính mô tả rõ ràng) và sử dụng bóng đổ thô cứng `shadow-lg`.
- **Chỉnh sửa**:
  - Cập nhật thuộc tính `aria-label` thành `"Tạo mới nhanh"`.
  - Thay thế class bóng đổ `shadow-lg` thành bóng đổ trôi nổi của hệ thống: `shadow-[0_2px_2px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.08)]`.
  - Cập nhật test case liên quan trong [layouts.test.tsx](file:///D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE/tests/layouts.test.tsx) từ `screen.getByRole("button", { name: "+" })` thành `screen.getByRole("button", { name: "Tạo mới nhanh" })` để đảm bảo test suite chạy đúng.

### 4. Kết quả chạy kiểm thử (Verification Results)
- Tất cả các kiểm thử layout và provider (`npx vitest run`) đều vượt qua 100% thành công.

## Fix Subagent Commit Information
- SHA: `edc7d2e`
- Subject: `fix(layout): resolve remaining tooltips and accessibility issues in navigation elements`

## Fix Subagent Update (Task 2 Remaining Issues - Part 2)

Chúng tôi đã giải quyết các vấn đề còn lại cuối cùng của Task 2 bao gồm:

### 1. Thiếu Tooltips và Aria-Labels cho các Item trong Sidebar khi Thu nhỏ (Critical)
- **Vấn đề**: Trong [owner-sidebar.tsx](file:///D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE/src/components/layouts/owner-sidebar.tsx), khi sidebar bị thu nhỏ (`isCollapsed` là `true`), các thẻ `<Link>` điều hướng chỉ hiển thị icon (icon-only controls) nhưng chưa được bọc trong Radix Tooltip và thiếu nhãn `aria-label`.
- **Chỉnh sửa**:
  - Bổ sung thuộc tính `aria-label={item.name}` cho mỗi thẻ `<Link>` điều hướng.
  - Khi sidebar bị thu nhỏ (`isCollapsed === true`), bọc mỗi liên kết bằng `Tooltip.Root`, `Tooltip.Trigger` và hiển thị nhãn tên tương ứng qua `Tooltip.Portal` và `Tooltip.Content` để hướng dẫn người dùng một cách trực quan.

### 2. Điều chỉnh Bo góc (Border Radius) cho các Nút dạng Card (Minor)
- **Vấn đề**: Trong [player-mobile-nav.tsx](file:///D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE/src/components/layouts/player-mobile-nav.tsx), các nút bấm lựa chọn ("Đặt sân nhanh" và "Tạo trận đấu") bên trong Action Sheet đang sử dụng class `rounded-2xl` (bo góc 16px). Theo như ràng buộc thiết kế, các nút này được xem là card-like controls và cần tuân thủ "card radius 12px" (`rounded-xl`).
- **Chỉnh sửa**: Thay đổi class bo góc của cả hai nút lựa chọn từ `rounded-2xl` thành `rounded-xl`.

### 3. Kết quả xác minh (Verification)
- Đã chạy kiểm thử `npx vitest run` thành công 100% với toàn bộ 12 test cases đều pass (bao gồm cả test suite `tests/layouts.test.tsx` và `tests/providers.test.tsx`).


