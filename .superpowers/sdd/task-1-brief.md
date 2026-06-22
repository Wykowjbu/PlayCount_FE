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
