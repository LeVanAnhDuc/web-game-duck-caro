import type { NextConfig } from 'next';

/**
 * Tĩnh hoàn toàn: không server, không API route, deploy lên GitHub Pages (ADR-0001).
 *
 * `basePath` đọc từ `NEXT_PUBLIC_BASE_PATH`, KHÔNG theo `NODE_ENV`. Lý do: `next build`
 * ở máy nào cũng là production, nên nếu gác theo `NODE_ENV` thì một lần build ở máy
 * mình cũng ra `basePath: '/web-game-duck-caro'` và `out/index.html` mở trực tiếp sẽ
 * hỏng toàn bộ đường dẫn asset. Chỉ workflow deploy đặt biến này (ADR-0010, ADR-0029);
 * trống hoặc không đặt nghĩa là gốc site. Biến này cũng là gốc của `redirect_uri`
 * đăng nhập Ducker ID, nên code client đọc cùng một giá trị.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
