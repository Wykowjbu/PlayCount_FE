# Task 1 Report: Project Initialization & Configuration

## 1. Files Changed
### Created Files
- `src/styles/tokens.css`: Chứa các CSS variables đại diện cho design system tokens từ file spec (màu sắc chủ đạo, màu nền canvas, v.v.).
- `src/providers/motion-provider.tsx`: Cung cấp `MotionConfig` thiết lập chế độ giảm chuyển động (`reducedMotion="user"`) dựa trên cấu hình hệ thống của người dùng.
- `src/providers/query-provider.tsx`: Cung cấp `QueryClientProvider` thiết lập TanStack React Query cho dự án.
- `vitest.config.ts`: Cấu hình Vitest chạy trong môi trường `jsdom`, load file setup và thiết lập path alias `@/`.
- `tests/setup.ts`: Setup file cho Vitest sử dụng `@testing-library/jest-dom`.
- `tests/providers.test.tsx`: Test suites kiểm tra render thành công của `MotionProvider` và `QueryProvider`.

### Modified Files
- `package.json`:
  - Cập nhật các dependencies (`@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`, `date-fns`, `lucide-react`, `motion`).
  - Cập nhật devDependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@testing-library/user-event`, `@vitejs/plugin-react`).
  - Thêm các test scripts (`test`, `test:watch`).
- `src/app/globals.css`:
  - Import `tokens.css`.
  - Cấu hình `@theme` của Tailwind v4 ánh xạ các CSS variables `--pc-*` thành các utility classes (ví dụ: `bg-pc-canvas`, `text-pc-body`, v.v.).
  - Thiết lập thuộc tính background màu `--pc-canvas` và text màu `--pc-body` cho thẻ `body`.
- `src/app/layout.tsx`:
  - Cập nhật title của ứng dụng thành "PlayCourt".
  - Bọc ứng dụng (`children`) bằng `QueryProvider` và `MotionProvider`.

## 2. Self-Review Findings
- **Dự án được khởi tạo chuẩn**: Khởi tạo bằng `create-next-app` và sau đó di chuyển thành công về thư mục gốc, khắc phục triệt để lỗi npm naming restrictions do thư mục cha chứa chữ in hoa.
- **Quản lý thư viện sạch sẽ**: Khắc phục lỗi symlinks của pnpm do đổi vị trí thư mục bằng cách xóa sạch `node_modules` cũ và chạy cài đặt mới.
- **Sử dụng motion đúng chuẩn**: framer-motion v12 được đổi tên package chính thức thành `motion`, vì vậy dự án sử dụng package `motion` và import từ `motion/react` cho các thành phần React.
- **Tailwind CSS v4 Integration**: Cú pháp `@theme` của Tailwind v4 được áp dụng đúng chuẩn để đăng ký các custom colors từ `tokens.css`.

## 3. Testing Evidence
Các unit test được thực thi thành công qua lệnh `pnpm test`.
Kết quả:
```
 RUN  v4.1.9 D:/Users/huynpde180519/fpt/SUMMER_26/PRN232/PlayCount_FE

 ✓ tests/providers.test.tsx (2 tests) 37ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:08:57
   Duration  4.99s (transform 137ms, setup 681ms, import 1.32s, tests 37ms, environment 2.57s)
```
