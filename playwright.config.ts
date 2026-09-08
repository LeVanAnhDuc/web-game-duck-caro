import { defineConfig, devices } from '@playwright/test';

const PORT = 3300;

/**
 * E2E chạy trên BẢN BUILD TĨNH, không trên dev server — ADR-0022.
 *
 * Lý do không phải sở thích: overlay dev-tools của Next là một phần tử THẬT trong thứ
 * tự Tab, nên đo `NFR-A11Y-02` trên dev server là đo một cây focus không tồn tại ở
 * production. Phát hiện ở mốc 6, bằng cách bấm Tab và thấy focus nhảy vào
 * `NEXTJS-PORTAL`.
 */
export default defineConfig({
  testDir: './e2e',
  // `src/` là đất của vitest (`vitest.config.mts` include `src/**/*.test.ts`). Hai bộ
  // test không được thấy file của nhau, nếu không mỗi lệnh chạy cả hai và cả hai đỏ.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
    // Khớp `viewport` của `layout.tsx`: bàn có thu phóng riêng, và zoom trình duyệt
    // đè lên nó sẽ làm hit-test lệch khỏi chỗ vẽ.
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    // `npx serve` sẽ là một dependency nữa; `http-server` cũng vậy. Node tự phục vụ
    // được `out/` bằng vài dòng, và một script trong repo là thứ đọc được, không phải
    // một hộp đen tải từ mạng lúc chạy test.
    // Cổng truyền qua ARGV: dự án này không đọc biến môi trường nào, và `.env.example`
    // nói đúng như thế — `docs-regen.sh` đối chiếu hai bên.
    command: `yarn build && node e2e/serve-out.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
