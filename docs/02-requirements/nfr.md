# Yêu cầu phi chức năng

> **Trả lời:** Ngưỡng nào áp cho **mọi** feature, để không phải nhắc lại từng lần?
> **Trạng thái:** 🟡 một phần — NFR-PERF-05 · NFR-PERF-07 còn thiếu một lần đo trên điện thoại THẬT;
> **NFR-PERF-06 KHÔNG ĐẠT ở mức Khó** — đã đo cả hai luật 2026-09-11, và luật không phải nguyên nhân; NFR-A11Y-07 và NFR-PERF-10 mới cấp, chưa đo
> **Cập nhật:** 2026-09-11 · commit —
> **Cập nhật khi:** thêm loại tài nguyên mới · thêm nhóm người dùng · sau sự cố sinh ra ngưỡng mới

<!-- CÁCH ĐIỀN
Đây là file AI BỎ QUA ÂM THẦM nếu nó trống — code vẫn chạy, test vẫn xanh, và
không có cảnh báo nào.

Mỗi dòng phải ĐO ĐƯỢC. Không viết được cách kiểm thì chưa phải yêu cầu:
  Sai:  "API phải nhanh"      Đúng: "p95 < 300ms cho endpoint đọc"
  Sai:  "phải bảo mật"        Đúng: "mọi mutation kiểm quyền ở server"

ID không tái dùng. Bỏ một ngưỡng thì đổi thành ~~(bỏ)~~, không xoá dòng.
Tài liệu thiết kế của feature tham chiếu ID ở dòng `Liên quan:` — KHÔNG chép nội dung sang.

ĐÃ RÀ 2026-09-03. Dự án này không có server, không có datastore, không có tài khoản,
không gửi dữ liệu ra ngoài. Nhiều ngưỡng mặc định của bản mẫu vì thế vô nghĩa ở đây —
chúng được ghi ~~(bỏ)~~ và GIỮ SỐ, còn ngưỡng thật của dự án lấy số tiếp theo. Không
tái dùng một ID cũ cho một ý nghĩa mới, vì `grep` sẽ trả về câu trả lời sai.
-->

## Performance

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-PERF-01 | ~~(bỏ)~~ phân trang endpoint danh sách — không có endpoint nào | — |
| NFR-PERF-02 | ~~(bỏ)~~ p95 endpoint đọc/ghi — không có server | — |
| NFR-PERF-03 | ~~(bỏ)~~ truy vấn N+1 — không có datastore | — |
| NFR-PERF-04 | ~~(bỏ)~~ index cho cột filter/sort — không có bảng nào | — |
| NFR-PERF-05 | Kéo và thu phóng bàn giữ 60fps trên máy tầm trung và trên một điện thoại thật | Performance panel của DevTools, ghi lại một lần kéo dài 5s |
| NFR-PERF-06 | AI trả nước trong ngân sách của mức (Dễ 200ms · Thường 600ms · Khó 1500ms) ở ≥ 95% số nước. **KHÔNG ĐẠT ở mức Khó** — xem khối bên dưới | `stats.ms` worker trả về · bench chạy tay trên `search`, hai thế bàn × ba mức × hai luật |
| NFR-PERF-07 | AI không chiếm main thread quá một frame (16ms) liên tục — mọi việc nặng nằm trong Worker | Performance panel: không có long task nào trên main thread khi AI đang nghĩ |
| NFR-PERF-08 | First Load JS ≤ **150 kB**. Đo: mốc 4 **114 kB** · mốc 5 **116 kB** · mốc 6 **118 kB** (2026-09-08) | `next build` rồi đọc cột First Load JS |
| NFR-PERF-09 | Lần tải đầu trên 4G mô phỏng: **LCP ≤ 2.5s** · **load ≤ 4.5s** · **truyền ≤ 700 kB**. Đo 2026-09-08 (5 lần, lấy trung vị): LCP **1.00s** · load **3.17s** · **526 kB**, và lần nào cũng chơi được ngay | `node e2e/measure-load.mjs --runs 5` trên bản build tĩnh (ADR-0022) |
| NFR-PERF-10 | Trang hiện ra **đã đúng giao diện đã chọn**, không có khung nào vẽ bằng bảng màu kia. Chưa đo — mới cấp 2026-09-11 (ADR-0026) | `e2e`: đặt `localStorage` theme = `dark`, tải bản build tĩnh, đọc `documentElement.dataset.theme` ở `document-start` |

### NFR-PERF-06 — số đo 2026-09-11, hai luật (ADR-0025)

7 lượt mỗi ô, hai thế bàn trung cuộc (`quiet` 8 quân · `busy` 18 quân), trên máy dev.
Cột **vượt** là số lượt quá ngân sách của mức đó.

| Thế bàn | Mức | Luật | trung vị | max | ngân sách | vượt | độ sâu |
| --- | --- | --- | --- | --- | --- | --- | --- |
| quiet | Dễ | blocked | 17ms | 20ms | 200ms | 0/7 | 2 |
| quiet | Dễ | free | 15ms | 19ms | 200ms | 0/7 | 2 |
| quiet | Thường | blocked | 278ms | 354ms | 600ms | 0/7 | 4 |
| quiet | Thường | free | 263ms | 294ms | 600ms | 0/7 | 4 |
| quiet | **Khó** | blocked | **1566ms** | 1652ms | 1500ms | **7/7** | 5 |
| quiet | **Khó** | free | **1598ms** | 2022ms | 1500ms | **7/7** | 5 |
| busy | Dễ | blocked | 21ms | 33ms | 200ms | 0/7 | 2 |
| busy | Dễ | free | 28ms | 38ms | 200ms | 0/7 | 2 |
| busy | Thường | blocked | 449ms | 572ms | 600ms | 0/7 | 4 |
| busy | Thường | free | 557ms | 725ms | 600ms | **3/7** | 4 |
| busy | **Khó** | blocked | **1587ms** | 1681ms | 1500ms | **7/7** | 5 |
| busy | **Khó** | free | **1599ms** | 1738ms | 1500ms | **7/7** | 5 |

**Mức Dễ và Thường đạt. Mức Khó KHÔNG đạt, ở cả hai luật, trên cả hai thế bàn** — và
nó chỉ tới được độ sâu **5**, không phải 6.

**Luật `free` không phải nguyên nhân.** Đã chạy một thí nghiệm đối chứng: bỏ hẳn phép so
sánh `rule === 'blocked'` ra khỏi `liveSegment` — tức trả đúng dòng nóng về hình dạng
trước ADR-0025 — rồi đo lại. `blocked` vẫn **1564ms** trung vị ở `quiet` và **1834ms** ở
`busy`, tức bằng hoặc chậm hơn bản có tham số luật. Chi phí của tham số luật nằm dưới
mức nhiễu giữa các lượt.

Vậy số **1221ms / độ sâu 6** của 2026-09-04 **không tái tạo được ở đây**. Hai khả năng
còn lại, chưa tách được: máy đo lần này chậm hơn máy đo lần đó, hoặc hai thế bàn ở đây
nặng hơn thế bàn lần đó (thế bàn cũ không được ghi lại — đó là bài học riêng, xem
`backlog.md`). Chênh `free` so với `blocked` ở ô `busy`/Thường (449 → 557ms, 3/7 vượt)
là chênh lớn nhất quy được cho luật, nhưng ở ô `quiet`/Thường thì `free` lại **nhanh
hơn** (263 so với 278ms) và số nút y hệt nhau (148) — nên hướng của chênh đó không nhất
quán, và nó cũng nằm trong nhiễu.

**Chưa nới ngân sách và chưa hạ độ sâu.** Cả hai đều là đổi ngưỡng hoặc đổi sản phẩm dựa
trên một phép đo chưa tách được nguyên nhân. Việc phải làm trước: đo lại trên cùng loại
máy đã dùng 2026-09-04, và ghi lại thế bàn để lần sau so được. Đang chờ ở
`backlog.md` §Đang làm.

NFR-PERF-08 đã có số thật từ `next build` (114 kB ở mốc 4, 116 kB ở mốc 5), và ngưỡng
150 kB được chọn từ chính con số đó. NFR-PERF-09 giờ đã có số thật, và ngưỡng được chốt **SAU** khi đo chứ không trước —
đúng thứ tự mà ô này yêu cầu từ đầu. Cấu hình đo, ghi ra để lần sau đo lại được giống
hệt: preset **Slow 4G** của Lighthouse (1.6 Mbps xuống · 750 Kbps lên · RTT 150ms),
**CPU chậm 4 lần**, khung nhìn 412×915 ở dpr 2 — tức một điện thoại tầm trung, vì
`overview.md` §3 nói nhóm chính chơi trên điện thoại.

Ngưỡng LCP 2.5s không phải số tự đặt: đó là biên "good" của Core Web Vitals. Hai
ngưỡng còn lại lấy từ chính số đo cộng một khoảng dư (~40%).

**526 kB truyền so với 118 kB First Load JS** không phải mâu thuẫn: phần chênh gần như
toàn bộ là **tám file woff2** của hai họ font (`MASTER.md` §4). Đây là chỗ đầu tiên nên
nhìn nếu ngày nào ngưỡng này bị vượt.

## Security

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-SEC-01 | ~~(bỏ)~~ mutation kiểm quyền ở server — không có server | — |
| NFR-SEC-02 | ~~(bỏ)~~ không log PII — không có log tập trung, và không có PII (xem NFR-DATA-01) | — |
| NFR-SEC-03 | ~~(bỏ)~~ rate limit đăng nhập — không có đăng nhập | — |
| NFR-SEC-04 | Không có secret nào trong repo hay trong bundle. Không hardcode, không commit | `grep` + review `.env.example` so với code |
| NFR-SEC-05 | Dependency không có lỗ hổng mức high trở lên | `yarn audit` chạy trong CI |
| NFR-SEC-06 | ~~(bỏ)~~ lỗi trả client không chứa stack trace — không có lỗi từ server | — |
| NFR-SEC-07 | Sau khi tải xong, trang không gửi request nào **ra ngoài origin của chính nó**. Không analytics, không telemetry, không font ngoài. Đo 2026-09-08 trên bản build tĩnh: **0 host ngoài**; font là woff2 tự phục vụ. Một chunk cùng origin (`953.js`) tải **sau** lần đầu, khi Worker khởi động — đó là code của chính app, không phải dữ liệu gửi đi | Network panel: mở game, chơi một ván, kiểm danh sách host |

## Accessibility

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-A11Y-01 | Tương phản chữ thường ≥ 4.5:1, chữ lớn ≥ 3:1. **Áp cả cho quân với nền bàn** — đây là ràng buộc cho palette, không phải cho chữ | DevTools + kiểm palette trong `MASTER.md` |
| NFR-A11Y-02 | ✅ có test E2E từ mốc 7. Mọi hành động thao tác được bằng bàn phím — kể cả **đánh quân và di chuyển bàn** — và focus luôn thấy được. **Đạt 2026-09-08** (mốc 6, ADR-0020): canvas có `tabIndex`, mũi tên dịch con trỏ, Shift + mũi tên kéo bàn, Enter đánh. Đã thử trên **bản build tĩnh**, không phải dev server — overlay dev-tools của Next chen vào thứ tự Tab và làm phép đo sai | `e2e/keyboard.spec.ts` — Tab tới canvas, mũi tên, Enter, Shift+mũi tên, `u`, `h`, tất cả trên bản build tĩnh |
| NFR-A11Y-03 | **Sửa cho khớp bàn vô hạn (ADR-0007).** Mọi nút thật ≥ 44×44px. Ô trên bàn nhỏ hơn thế và không thể lớn hơn, nên bù bằng: hit-test bắt tâm ô gần nhất trong một bán kính rộng hơn ô, cộng bước xác nhận trên cảm ứng | Review mockup cho các nút · test hit-test ở nhiều mức phóng |
| NFR-A11Y-04 | Mọi input trong cài đặt có label liên kết; thông báo đọc được bởi screen reader | Review |
| NFR-A11Y-05 | Tôn trọng `prefers-reduced-motion` — camera nhảy thẳng thay vì trượt, không có animation thắng | Bật thiết lập rồi thử tay |
| NFR-A11Y-06 | Canvas có nhãn, và có vùng `aria-live="polite"` đọc mỗi nước đi kèm toạ độ, cùng kết quả ván. Ở hot-seat vùng này cũng đọc **ghế nào đang tới lượt** (ADR-0028) | Thử với screen reader một lượt |
| NFR-A11Y-07 | **Mỗi bộ quân** (FR-20): hai hình phân biệt được khi ảnh bị **xám hoá**, và ở ô **16px** (`--cell-min`). Chưa đo — mới cấp 2026-09-11 (ADR-0027) | Chụp bàn ở mức phóng nhỏ nhất cho từng bộ, xám hoá, nhìn tận mắt · kiểm ở cả hai giao diện |

## i18n

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-I18N-01 | Không hardcode chuỗi hiển thị trong code. Toàn bộ chuỗi nằm trong `lib/strings` | `grep` tìm chuỗi tiếng Việt ngoài `lib/strings` |
| NFR-I18N-02 | Mốc thời gian lưu ở UTC; đổi múi giờ chỉ ở tầng hiển thị | Test |
| NFR-I18N-03 | Định dạng ngày và số theo locale người dùng, ở tầng hiển thị | Review |

## Reliability

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-REL-01 | Mọi tác vụ bất đồng bộ có timeout và nhánh xử lý lỗi. Worker: 5s, hết hạn thì dùng nước dự phòng | Test: worker không trả lời → game vẫn đi tiếp |
| NFR-REL-02 | Đánh hai lần thật nhanh vào cùng một ô chỉ tạo **một** nước | Test |
| NFR-REL-03 | Không có trạng thái chờ vô hạn trên UI. "Máy đang nghĩ" luôn kết thúc, kể cả khi worker chết | Thử tay: kill worker trong DevTools |
| NFR-REL-04 | `localStorage` bị chặn, đầy, hoặc dữ liệu hỏng → về mặc định và chơi được. Được phép **quên**, không được phép **vỡ** | Test với `localStorage` giả ném lỗi · thử tay trong cửa sổ ẩn danh |

## Data & Privacy

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-DATA-01 | Trường nào là PII được liệt kê rõ ở bảng dưới | Bảng dưới |
| NFR-DATA-02 | ~~(bỏ)~~ xoá tài khoản thì xoá PII — không có tài khoản ở v1 | — |
| NFR-DATA-03 | ~~(bỏ)~~ đường khôi phục dữ liệu / backup — dữ liệu nằm trên máy người chơi và không có bản sao nào; mất là mất, và điều đó được nói rõ ở UI | — |
| NFR-DATA-04 | Người chơi xoá được toàn bộ dữ liệu game (ván đang chơi, thống kê, cài đặt) từ trong chính game | Thử tay |

**Trường PII trong dự án này:**

| Trường | Nằm ở | Giữ bao lâu |
| --- | --- | --- |
| **Không có** — v1 không đăng nhập, không tên người dùng, không gửi gì ra ngoài (NFR-SEC-07) | — | — |

Bảng này **đã được rà**, không phải chưa điền. Điều kiện thay đổi: khi ghép Ducker ID
(ADR-0006) sẽ xuất hiện `displayName` và một id người dùng — lúc đó bảng này phải được
điền lại trước khi tính năng đăng nhập lên production.
