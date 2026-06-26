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
