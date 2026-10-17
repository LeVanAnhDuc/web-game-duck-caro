import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  /*
   * `tsconfig.json` đặt `jsx: "preserve"` cho Next, và trình transform của Vite đi theo
   * thiết lập đó — nên trước khối này, mọi file `.tsx` import vào test đều nổ với
   * "invalid JS syntax". Đó là lý do tới mốc 4 chưa có test component nào.
   *
   * Phải là `oxc`, KHÔNG phải `esbuild`: Vite 8 đã đổi sang Oxc, và khóa `esbuild`
   * bây giờ bị bỏ qua IM LẶNG — config trông như đúng mà không có tác dụng gì.
   *
   * Chỉ đặt ở đây, KHÔNG đổi `tsconfig.json`: bản build thật vẫn do Next biên dịch.
   */
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
