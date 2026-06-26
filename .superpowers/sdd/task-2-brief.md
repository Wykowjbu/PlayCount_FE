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
