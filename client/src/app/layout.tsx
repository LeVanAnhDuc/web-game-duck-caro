import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { themeBootScript } from '@/game/render/theme';
import { settingsKey } from '@/game/storage/keys';
import { strings } from '@/lib/strings';
import './globals.css';

/**
 * `next/font/google` tải font lúc BUILD và phục vụ từ origin của chính mình.
 * NFR-SEC-07 ghi rõ "không font ngoài", nên một `<link>` tới fonts.googleapis.com
 * sẽ vi phạm — dù mockup trên canvas có dùng cách đó, vì canvas không có bước build.
 */
const ui = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: strings.appName,
  description: strings.appTagline,
};

/**
 * `maximumScale: 1` là cố ý: bàn có thu phóng riêng, và zoom của browser đè lên nó
 * làm hit-test lệch khỏi chỗ vẽ.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${ui.variable} ${mono.variable}`}>
      <head>
        {/*
          Chống nháy màu khi tải — ADR-0026 · NFR-PERF-10.

          Bản build là static export (ADR-0001), nên không có server để đọc lựa chọn
          và trả HTML đã đúng theo. Lựa chọn nằm trong `localStorage`, mà `localStorage`
          chỉ đọc được bằng JavaScript. Nếu đợi React thì trình duyệt đã vẽ xong một
          khung bằng bảng SÁNG — với người chọn nền tối, đó là một chớp trắng toàn màn.

          Phải là `dangerouslySetInnerHTML` đặt tay: `next/script` kể cả với
          `strategy="beforeInteractive"` vẫn không chạy trước lần vẽ đầu tiên.

          Nội dung script nằm ở `game/render/theme.themeBootScript` — nó không bao giờ
          ném, và đó là điều kiện sống của nó: một ngoại lệ ở đây làm trắng cả trang.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: themeBootScript(settingsKey()) }}
        />
      </head>
      <body className="font-ui">{children}</body>
    </html>
  );
}
