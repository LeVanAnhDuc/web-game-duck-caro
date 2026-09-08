# ADR-0022 · E2E chạy trên bản build tĩnh, không trên dev server

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-02 · NFR-SEC-07 · ADR-0001 · ADR-0010

## 1. Bối cảnh

Cách rẻ nhất để chạy E2E là trỏ Playwright vào `next dev`: không cần build, có
hot-reload, khởi động nhanh.

Mốc 6 cho thấy cách đó **đo sai**. Khi kiểm `NFR-A11Y-02` bằng tay, `Tab` từ canvas
nhảy vào một phần tử `NEXTJS-PORTAL` — overlay dev-tools của Next, nằm thật trong thứ
tự Tab và **không tồn tại** ở bản production. Một test a11y trên dev server sẽ hoặc đỏ
vì một phần tử không có thật, hoặc xanh vì đã được viết để chấp nhận nó.

Dev server còn khác bản ship ở những chỗ khác: không minify, chunk chia khác, `NODE_ENV`
khác, và không có `basePath` của GitHub Pages.

## 2. Quyết định

`playwright.config.ts` dùng `webServer` chạy `yarn build` rồi phục vụ `out/` tĩnh. E2E
luôn kiểm **đúng những byte sẽ lên GitHub Pages** (ADR-0001 · ADR-0010).

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Trỏ vào `next dev` | Cây focus khác production (overlay dev-tools nằm trong thứ tự Tab). Một bộ test a11y đo trên cây focus không tồn tại là một bộ test không nói gì. |
| Chạy trên `next start` (server production) | Gần hơn, nhưng sản phẩm này **không có server** — nó là static export. Kiểm trên một chế độ chạy mà app không bao giờ dùng là kiểm một app khác. |
| Tắt dev overlay bằng cấu hình rồi vẫn dùng dev server | Chữa đúng một điểm khác biệt trong nhiều điểm, và cách tắt nó là chi tiết nội bộ của Next — nó đổi thì test lặng lẽ quay về đo sai. |

## 4. Hệ quả

**Được:**
- E2E kiểm đúng thứ sẽ ship, kể cả `basePath`, minify và cách chia chunk.
- Cây focus, và vì thế `NFR-A11Y-02`, đo được một cách có nghĩa.

**Mất / phải chấp nhận:**
- Mỗi lần chạy E2E kèm một lần build (~35s trên máy dev). Không còn hot-reload cho
  người viết test.
- Sửa `src/` rồi chạy lại E2E phải build lại; dễ quên và ngồi nhìn kết quả cũ.

**Điều kiện xem lại quyết định này:** nếu Next cho một cờ chính thức tắt hẳn mọi thứ
dev-only, và thời gian build trở thành điểm nghẽn thật của vòng lặp phát triển.
