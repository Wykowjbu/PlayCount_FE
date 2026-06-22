# PlayCourt Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khởi tạo và xây dựng hoàn chỉnh giao diện frontend PlayCourt theo đặc tả UI Spec Vercel, tích hợp API Backend hiện có và mock dữ liệu cho các tính năng thiếu.

**Architecture:** Sử dụng Next.js App Router (React, TypeScript), Tailwind CSS để tạo kiểu dáng dựa trên các token của Vercel (màu sắc, khoảng cách, font Geist). Tích hợp Animate UI components, sử dụng TanStack Query cho quản lý server state, Zustand cho client state và react-hook-form + Zod cho validate biểu mẫu. Kết nối tới API Backend cục bộ (localhost:5187) và mock dữ liệu cho các endpoints chưa hoàn thiện (booking, matchmaking, admin).

**Tech Stack:** Next.js App Router, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, date-fns, Framer Motion (motion/react).

## Global Constraints

- Geist Sans cho display text, Geist Mono cho eyebrows/labels.
- Màu canvas `#fafafa`, elevated surface `#ffffff`, border 1px hairline `#ebebeb` trước shadow, không dùng shadow nặng.
- app control/input radius 6px, card radius 12px, dialog/panel 16px, marketing CTA pill 100px.
- Accent color chính là xanh/optic-lime (tennis-green) làm điểm nhấn, không phủ xanh toàn trang. Chữ trên nền tennis-green phải dùng màu ink (#171717).
- Chỉ sử dụng một hệ component duy nhất: Animate UI components (Radix UI, Base UI, Buttons, Community). Không dùng MUI, Ant Design, Chakra UI, mantine, shadcn/ui ngoài Animate UI dependencies.
- Motion Config reducedMotion="user" ở root để tôn trọng cấu hình hệ thống của người dùng.
- Mọi control icon-only phải bọc Tooltip và có aria-label.
- Khi API backend thiếu tính năng, tiến hành mock dữ liệu trên frontend qua fetch client/mock service.

---

### Task 1: Project Initialization & Configuration

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/providers/motion-provider.tsx`, `src/providers/query-provider.tsx`, `src/styles/tokens.css`, `vitest.config.ts`, `tests/setup.ts`

**Interfaces:**
- Produces: Base project setup với các provider và test runner (Vitest) hoạt động tốt.

- [ ] **Step 1: Khởi tạo Next.js app**
  Chạy lệnh: `npx -y create-next-app@latest ./ --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes`
  Đảm bảo dự án được tạo trực tiếp tại thư mục workspace.

- [ ] **Step 2: Cài đặt các thư viện dependencies bắt buộc**
  Chạy lệnh: `pnpm add @tanstack/react-query zustand react-hook-form zod @hookform/resolvers date-fns lucide-react motion/react`
  Cài đặt devDependencies cho testing: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @testing-library/user-event`

- [ ] **Step 3: Cấu hình CSS Tokens và globals.css**
  Tạo file `src/styles/tokens.css` chứa các biến CSS từ `DESIGN-vercel.md` và `PlayCourt_UI_Spec_AnimateUI.md`:
  ```css
  :root {
    --pc-ink: #171717;
    --pc-body: #4d4d4d;
    --pc-mute: #8f8f8f;
    --pc-faint: #a1a1a1;
    --pc-hairline: #ebebeb;
    --pc-hairline-soft: #f2f2f2;
    --pc-canvas: #fafafa;
    --pc-surface: #ffffff;

    --pc-green-950: #0b2e13;
    --pc-green-900: #14532d;
    --pc-green-800: #166534;
    --pc-green-700: #15803d;
    --pc-green-600: #16a34a;
    --pc-green-500: #22c55e;
    --pc-green-200: #bbf7d0;
    --pc-green-100: #dcfce7;
    --pc-green-50: #f0fdf4;

    --pc-tennis: #c7f227;
    --pc-tennis-soft: #f2fbce;
    --pc-tennis-ink: #171717;

    --pc-success: #15803d;
    --pc-success-soft: #dcfce7;
    --pc-warning: #f5a623;
    --pc-warning-soft: #ffefcf;
    --pc-warning-deep: #ab570a;
    --pc-error: #ee0000;
    --pc-error-deep: #c50000;
    --pc-info: #0070f3;
    --pc-info-soft: #d3e5ff;
  }
  ```
  Import `tokens.css` trong `src/app/globals.css` và thiết lập màu nền canvas cho body.

- [ ] **Step 4: Tạo MotionProvider & QueryProvider**
  Tạo `src/providers/motion-provider.tsx` hỗ trợ reduced motion:
  ```tsx
  'use client';
  import { MotionConfig } from 'motion/react';
  export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
  }
  ```
  Tạo `src/providers/query-provider.tsx` cho TanStack Query:
  ```tsx
  'use client';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { useState } from 'react';
  export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
      defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } }
    }));
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  ```
  Cập nhật `src/app/layout.tsx` bọc children bằng hai providers này.

- [ ] **Step 5: Cấu hình Vitest và viết test đầu tiên**
  Tạo file `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  });
  ```
  Tạo `tests/setup.ts`:
  ```ts
  import '@testing-library/jest-dom';
  ```
  Tạo test `tests/providers.test.tsx` kiểm tra render của `MotionProvider`.
  Chạy lệnh: `npx vitest run` và đảm bảo kết quả PASS.

- [ ] **Step 6: Commit**
  Chạy:
  ```bash
  git add .
  git commit -m "feat: init Next.js project with Tailwind, Vitest and Providers"
  ```

---

### Task 2: Global Layout Shell (Header & Navigation)

**Files:**
- Create: `src/components/layouts/player-header.tsx`, `src/components/layouts/player-mobile-nav.tsx`, `src/components/layouts/owner-sidebar.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: Layout header/footer và mobile navigation cho Player, sidebar cho Owner/Admin.

- [ ] **Step 1: Viết test cho layout shell components**
  Tạo `tests/layouts.test.tsx` kiểm tra sự tồn tại của các semantic tags (`header`, `nav`, `aside`) trong các component layout sẽ tạo.
  Chạy test để verify FAIL.

- [ ] **Step 2: Tạo PlayerHeader (Desktop layout)**
  Xây dựng `src/components/layouts/player-header.tsx`:
  - Chiều cao `64px`, `sticky top-0`, nền canvas độ mờ 92% có blur.
  - Logo `PlayCourt` font Geist 600 kèm dấu chấm tròn màu xanh tennis.
  - Danh sách link: Tìm sân, Tìm trận, Booking. Link active có gạch chân 2px tennis green.
  - Icon Button Search, Bell (Popover list thông báo), và Dropdown Menu Avatar người dùng.

- [ ] **Step 3: Tạo PlayerMobileNav (Mobile layout)**
  Xây dựng `src/components/layouts/player-mobile-nav.tsx`:
  - Thanh dưới chân di động `h-16`, flexbox phân bổ đều các tabs: Home, Sân, Trận, Tôi.
  - Nút chính giữa `+` màu `green-800`, hình tròn click mở Sheet (Đúc từ Radix Sheet / Animate UI) gồm 2 option: "Đặt sân nhanh" và "Tạo trận đấu".

- [ ] **Step 4: Tạo OwnerSidebar (Pro layout)**
  Xây dựng `src/components/layouts/owner-sidebar.tsx`:
  - Chiều rộng `248px` khi mở, `72px` khi thu nhỏ.
  - Active item có nền `green-50`, chữ ink, viền trái xanh `green-700` rộng 2px.
  - Hỗ trợ dropdown chọn địa điểm (Venue selector) ở đầu sidebar.

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run` verify các test pass.
  Chạy:
  ```bash
  git add src/components/layouts src/app/layout.tsx tests/layouts.test.tsx
  git commit -m "feat: add player layout headers and owner sidebar"
  ```

---

### Task 3: Shared Business Components & Primitives

**Files:**
- Create: `src/components/playcourt/button.tsx`, `src/components/playcourt/input.tsx`, `src/components/playcourt/status-badge.tsx`, `src/components/playcourt/venue-card.tsx`, `src/components/playcourt/match-card.tsx`

**Interfaces:**
- Produces: Thư viện component primitive dùng chung tuân thủ Vercel design token.

- [ ] **Step 1: Viết unit tests cho Button, Input, StatusBadge**
  Tạo `tests/primitives.test.tsx` kiểm tra các variant của Button, class error của Input và màu nền tương ứng của StatusBadge. Verify FAIL.

- [ ] **Step 2: Tạo Button & Input Primitives**
  Tạo `src/components/playcourt/button.tsx` hỗ trợ variants: `MarketingPrimary` (pill shape, ink), `AppPrimary` (6px, green-800), `CommitPrimary` (Ripple animation, green-800), `Secondary` (outline), `Danger` (error color).
  Tạo `src/components/playcourt/input.tsx` bọc native `<input>` kèm wrapper label, css focus green ring, error borders, hỗ trợ aria-describedby cho error message.

- [ ] **Step 3: Tạo StatusBadge**
  Tạo `src/components/playcourt/status-badge.tsx` hiển thị trạng thái nghiệp vụ. Trả về nhãn có màu nền và chữ tương ứng:
  - `confirmed` / `paid` / `verified`: nền `green-100`, chữ `green-900`.
  - `pending` / `needs action`: nền warning-soft, chữ warning-deep.
  - `failed` / `rejected` / `cancelled`: nền `#fee2e2`, chữ error-deep.
  - `draft` / `completed`: nền hairline-soft, chữ body.

- [ ] **Step 4: Tạo VenueCard & MatchCard**
  Tạo `src/components/playcourt/venue-card.tsx` theo spec: ảnh 16:9, nhãn sport mono-eyebrow, rating, slot chip gần nhất (nền green-50), button outline "Xem lịch".
  Tạo `src/components/playcourt/match-card.tsx`: hiển thị thông tin trận đấu, tích hợp `AvatarGroup` cho danh sách người tham gia, status badge.

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/components/playcourt tests/primitives.test.tsx
  git commit -m "feat: implement shared primitives and business cards"
  ```

---

### Task 4: Player Phase - Home & Search Venue Screen

**Files:**
- Create: `src/app/(public)/page.tsx`, `src/app/(public)/venues/page.tsx`, `src/components/playcourt/date-picker.tsx`, `src/lib/api/client.ts`

**Interfaces:**
- Consumes: Primitives từ Task 3.
- Produces: Trang chủ tìm kiếm và trang danh sách kết quả tìm sân kèm filter.

- [ ] **Step 1: Viết client API wrapper với mock capability**
  Tạo `src/lib/api/client.ts` kết nối tới BE (localhost:5187). Nếu endpoint chưa có (ví dụ tìm kiếm venue nâng cao), tự động fallback trả về dữ liệu mock.
  Tạo test `tests/api.test.tsx` verify client fetch hoạt động.

- [ ] **Step 2: Tạo DatePicker component**
  Tạo `src/components/playcourt/date-picker.tsx` sử dụng popover Radix (hoặc custom float panel nếu chưa cài Radix) + grid lịch tự dựng bằng các nút ngày, ngày selected có nền `green-800` chữ trắng.

- [ ] **Step 3: Xây dựng trang Home**
  Trong `src/app/(public)/page.tsx`:
  - Khung Hero chứa tiêu đề lớn Geist Sans 600, tracking -2.4px, nền Gradient Vercel mesh.
  - Form tìm kiếm nhanh (Địa điểm, Môn thể thao dropdown, Ngày DatePicker, CTA Tìm sân).
  - Mục các môn phổ biến (ToggleGroup) và danh sách gợi ý sân gần bạn (VenueCard).

- [ ] **Step 4: Xây dựng trang Search Venues**
  Trong `src/app/(public)/venues/page.tsx`:
  - Thanh tìm kiếm summary trên đầu.
  - Layout: Cột trái Filter Sidebar (Môn, Khoảng cách, Giá, Tiện ích checkbox), Cột phải Danh sách kết quả hiển thị dạng list VenueCard wide. Hỗ trợ responsive chuyển cột trái thành bottom Sheet trên di động.

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/(public) src/components/playcourt/date-picker.tsx src/lib/api/client.ts tests/api.test.tsx
  git commit -m "feat: complete Home and Search Venues screen with filters"
  ```

---

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

---

### Task 6: Player Phase - Checkout & Booking Detail

**Files:**
- Create: `src/app/(player)/bookings/checkout/page.tsx`, `src/app/(player)/bookings/[id]/page.tsx`, `src/stores/booking-store.ts`

**Interfaces:**
- Consumes: Zustand store để lưu trữ thông tin slot đã chọn từ Task 5.
- Produces: Trang thanh toán đặt sân và trang xem chi tiết đơn đặt.

- [ ] **Step 1: Tạo booking checkout store**
  Tạo `src/stores/booking-store.ts` quản lý state checkout nháp (sân, ngày, giờ đã chọn, thông tin liên hệ).
  Viết test `tests/booking-store.test.tsx` kiểm tra cập nhật và reset state.

- [ ] **Step 2: Xây dựng trang Checkout**
  Trong `src/app/(player)/bookings/checkout/page.tsx`:
  - Form nhập thông tin người đặt, ghi chú.
  - Voucher/Coupon reveal (Accordion).
  - RadioGroup chọn hình thức thanh toán (Thẻ, ví điện tử, chuyển khoản). Viền Checkbox chấp nhận điều khoản.
  - Cột summary bên phải hiển thị chi tiết đặt sân, phí, chính sách hoàn hủy.
  - Button thanh toán dạng `CommitPrimary` (RippleButton), có trạng thái loading và vô hiệu hóa nút sau khi click để tránh double-submit.

- [ ] **Step 3: Xây dựng trang Booking Detail**
  Trong `src/app/(player)/bookings/[id]/page.tsx`:
  - Hiển thị Mã đơn đặt (ID mono) có CopyButton bên cạnh, StatusBadge lớn.
  - Các tab thông tin: Tổng quan, Thanh toán, Lịch sử trạng thái (dựng timeline list).
  - Nút "Hủy đặt sân" mở AlertDialog cảnh báo số tiền hoàn và lý do hủy.

- [ ] **Step 4: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/(player)/bookings src/stores/booking-store.ts tests/booking-store.test.tsx
  git commit -m "feat: complete Checkout flow and Booking Detail page"
  ```

---

### Task 7: Matchmaking Phase - Discover & Create Match

**Files:**
- Create: `src/app/(player)/matches/page.tsx`, `src/app/(player)/matches/create/page.tsx`, `src/app/(player)/matches/[id]/page.tsx`

**Interfaces:**
- Produces: Trang tìm kiếm trận đấu, chi tiết trận đấu và form tạo trận wizard.

- [ ] **Step 1: Viết test cho Match Wizard form validation**
  Tạo `tests/match-wizard.test.tsx` kiểm tra kiểm lỗi (validation) qua từng bước của form tạo trận. Verify FAIL.

- [ ] **Step 2: Xây dựng trang Discover Matches**
  Trong `src/app/(player)/matches/page.tsx`:
  - Banner giới thiệu "Tìm đội hợp trình độ".
  - Bộ lọc: Môn thể thao, trình độ (2.5 - 3.5, v.v.), khu vực.
  - Danh sách MatchCard hiển thị các trận đang mở rộng người chơi, có số lượng thành viên hiện tại (`AvatarGroup`).

- [ ] **Step 3: Xây dựng trang Create Match Wizard**
  Trong `src/app/(player)/matches/create/page.tsx`:
  - Tiến trình các bước (`AUI/Progress`): 1. Cơ bản -> 2. Sân & Giờ -> 3. Người chơi -> 4. Xác nhận.
  - Chọn môn thể thao (ToggleGroup), loại trận đấu (RadioGroup), tự động duyệt thành viên (Switch).
  - Hỗ trợ lưu bản nháp tự động (autosave draft) sau 800ms nhàn rỗi.

- [ ] **Step 4: Xây dựng trang Match Detail**
  Trong `src/app/(player)/matches/[id]/page.tsx`:
  - Thông tin trận đấu, địa điểm (bản đồ mini), trình độ yêu cầu.
  - Host info (`HoverCard`), danh sách người tham gia kèm chỉ báo online (`UserPresenceAvatar`).
  - Nút "Yêu cầu tham gia" (`RippleButton`). Nếu là host, hiển thị danh sách yêu cầu chờ duyệt ở panel bên phải.

- [ ] **Step 5: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/(player)/matches tests/match-wizard.test.tsx
  git commit -m "feat: implement Discover Matches, detail and Create Match Wizard"
  ```

---

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

---

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

---

### Task 10: Admin Console - KYC Review & Moderation

**Files:**
- Create: `src/app/admin/kyc/page.tsx`, `src/app/admin/moderation/page.tsx`

**Interfaces:**
- Produces: Giao diện quản trị hệ thống cho Admin duyệt KYC và quản lý thực thể.

- [ ] **Step 1: Viết test cho Admin KYC approval actions**
  Tạo `tests/admin-kyc.test.tsx` verify các hành động click Duyệt, Yêu cầu bổ sung, Từ chối gửi đúng API call. Verify FAIL.

- [ ] **Step 2: Xây dựng trang KYC Review Queue**
  Trong `src/app/admin/kyc/page.tsx`:
  - Danh sách hồ sơ KYC chờ duyệt (Chờ duyệt, Cần bổ sung, Đã duyệt, Đã từ chối).
  - Khung xem tài liệu đính kèm (Document viewer) hỗ trợ zoom/rotate.
  - Nhóm nút thao tác: "Duyệt" (RippleButton xanh), "Yêu cầu thông tin thêm" (nút outline), "Từ chối" (mở Dialog yêu cầu nhập lý do từ chối).

- [ ] **Step 3: Xây dựng trang Moderation**
  Trong `src/app/admin/moderation/page.tsx`:
  - Bảng quản trị danh sách User và Venue trong hệ thống.
  - Hỗ trợ khóa/mở khóa thực thể kèm cảnh báo qua AlertDialog.
  - Mock dữ liệu danh sách người dùng và trạng thái kiểm duyệt.

- [ ] **Step 4: Run tests & Commit**
  Chạy `npx vitest run`.
  Chạy:
  ```bash
  git add src/app/admin tests/admin-kyc.test.tsx
  git commit -m "feat: implement Admin KYC Review and User/Venue Moderation"
  ```
