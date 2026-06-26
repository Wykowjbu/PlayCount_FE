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
