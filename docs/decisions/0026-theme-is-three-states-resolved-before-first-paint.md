# ADR-0026 · Giao diện có ba trạng thái, và được quyết TRƯỚC lần vẽ đầu tiên

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-19 · US-06 · NFR-A11Y-01 · NFR-PERF-09 · ADR-0001 · ADR-0019

## 1. Bối cảnh

Chế độ tối đã có đủ token từ mốc 1 (`MASTER.md` §2) và đang chạy qua đúng một khối
`@media (prefers-color-scheme: dark)` trong `globals.css`. Người chơi không có cách nào
chọn — máy để sáng thì không xem được bản tối, và ngược lại.

Hai ràng buộc làm việc này khó hơn vẻ ngoài:

1. **Bản build là static export (ADR-0001).** Không có server để đọc cookie và trả HTML
   đã đúng theo. Lựa chọn nằm trong `localStorage`, mà `localStorage` chỉ đọc được bằng
   JavaScript — sau khi trình duyệt đã vẽ xong lần đầu.
2. **Canvas đọc màu từ CSS custom property** (`render/palette.ts`), không hardcode hex.
   Nó đi theo CSS miễn phí, nhưng nó **không tự biết** lúc nào cần vẽ lại.

## 2. Quyết định

**Ba trạng thái, không phải hai:** `Theme = 'light' | 'dark' | 'system'`, mặc định
`'system'`. Lưu trong `settingsStore` (ADR-0019 — đây là cài đặt của MÁY: chọn nền tối
ở máy công ty không được làm tối máy ở nhà).

**Chọn bằng `data-theme` trên `<html>`, ba tầng CSS theo đúng thứ tự:**

```css
:root { /* token sáng */ }
@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { /* token tối */ } }
:root[data-theme='dark'] { /* token tối */ }
```

Không có `data-theme` nghĩa là `'system'`. Khối thứ ba phải đứng sau khối `@media` để
lựa chọn tay thắng được cả hai chiều.

**Một script inline trong `<head>`** đọc `localStorage` và đặt `data-theme` **trước lần
vẽ đầu tiên**. Đây là chỗ duy nhất trong dự án được phép chạm `localStorage` ngoài hai
seam của bất biến 5 — nó chạy trước cả React, nên không có seam nào để đi qua. Ghi rõ ở
đây để lần sau không ai coi đó là seam thứ ba.

**Canvas vẽ lại khi theme đổi:** một `MutationObserver` trên thuộc tính `data-theme` của
`<html>`, cộng một listener `prefers-color-scheme` cho trạng thái `'system'`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Hai trạng thái, sáng ↔ tối | Mất trạng thái mặc định hiện tại. Người để máy tự đổi theo giờ sẽ bị ghim cứng vào một bên ngay lần đầu bấm |
| Class `.dark` trên `<body>` kiểu Tailwind | `<body>` chưa tồn tại lúc script trong `<head>` chạy. Đặt trên `<html>` là cách duy nhất quyết được trước lần vẽ đầu |
| Bỏ script inline, chấp nhận một nháy sáng | Người chọn nền tối sẽ ăn một chớp trắng toàn màn hình mỗi lần mở. Trên nền `--paper` sáng thì đó là chớp mạnh nhất có thể |
| Ghi theme vào cookie và render đúng từ server | Không có server (ADR-0001), và có server thì cũng phá trần chi phí 0đ |
| Canvas tự đọc lại palette mỗi khung | Đọc `getComputedStyle` mỗi khung là ép trình duyệt tính lại layout 60 lần mỗi giây — đổi một lỗi nhìn thấy lấy một lỗi `NFR-PERF-05` |

## 4. Hệ quả

**Được:**

- Không có bản sao thứ hai của palette: canvas vẫn đọc chính các biến CSS đó.
- Không nháy màu lúc tải, ở cả ba trạng thái.
- `NFR-A11Y-01` không phải kiểm lại — cả hai bảng màu đã có số đo từ `MASTER.md`.

**Mất / phải chấp nhận:**

- **Một script inline trong `<head>`**, tức một ngoại lệ có tên của bất biến 5, và một
  đoạn JS không đi qua bundler nên không có test đơn vị nào chạm tới nó. Bù bằng một
  test E2E: đặt `localStorage`, tải trang, đọc `data-theme` ngay khi có `<html>`.
- `next/script` với `strategy="beforeInteractive"` không đủ sớm cho việc này; phải là
  `dangerouslySetInnerHTML` đặt tay trong `layout.tsx`.
- Thêm vài trăm byte vào HTML của mọi lần tải (`NFR-PERF-09` đo bằng kB — mức này không
  đáng kể, nhưng nó là chi phí có thật và cố định).

**Điều kiện xem lại quyết định này:** nếu dự án bỏ static export và có một tầng server
thật — lúc đó theme quyết được ở server và script inline thành thừa.
