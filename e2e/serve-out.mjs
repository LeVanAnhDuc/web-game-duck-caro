// Phục vụ `out/` tĩnh cho E2E — ADR-0022.
//
// Viết tay thay vì thêm một dependency: một server 40 dòng đọc được trong repo tốt hơn
// một gói tải từ mạng lúc chạy test, và `NFR-SEC-07` là ngưỡng mà chính E2E phải đo.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'out');
/*
 * CỔNG LẤY TỪ ARGV, không từ biến môi trường.
 *
 * `.env.example` tuyên bố dứt khoát rằng dự án này không đọc biến môi trường nào, và
 * `docs-regen.sh` đối chiếu điều đó với code thật — và nó quét bằng chuỗi, nên kể cả một
 * comment nhắc tên biến cũng bị tính. Đọc biến môi trường ở đây sẽ buộc
 * phải thêm một dòng vào file đó — và làm người đọc tưởng chạy game cần cấu hình,
 * trong khi cái cần cấu hình chỉ là máy chạy test.
 */
const PORT = Number(process.argv[2] ?? 3300);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(ROOT)) {
  console.error(`khong thay ${ROOT} — chay \`yarn build\` truoc`);
  process.exit(1);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  // `normalize` + kiểm tiền tố: chặn `../` đi ra khỏi `out/`. Server này chỉ chạy trên
  // máy chạy test, nhưng một server có path traversal thì không nên tồn tại ở đâu cả.
  const wanted = normalize(join(ROOT, decodeURIComponent(url.pathname)));
  if (!wanted.startsWith(ROOT)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  let file = wanted;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) file = join(ROOT, '404.html');
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
    // `content-length` KHÔNG phải thứ trang trí: `measure-load.mjs` cộng số byte tải
    // về từ header này, và thiếu nó thì phép đo trả về 0 mà không báo lỗi gì.
    'content-length': statSync(file).size,
    // Không cache: mỗi lần chạy test phải đọc đúng bản build vừa xong.
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => {
  console.log(`serving out/ on http://127.0.0.1:${PORT}`);
});
