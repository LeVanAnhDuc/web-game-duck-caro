# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-11 · commit — *(mốc 8 mở)*
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

<!-- CÁCH ĐIỀN
Mục "Đang làm" là chỗ một phiên làm việc MỚI đọc đầu tiên. Giữ nó ngắn: đang làm
gì, dừng ở bước nào, cái gì đang chặn. Cập nhật nó TRƯỚC KHI DỪNG phiên, không
phải sau.

Mục "Nợ kỹ thuật" chỉ ghi thứ CỐ Ý làm tạm, và ghi NGAY LÚC ĐÓ. Bug thì không
thuộc đây. Việc chưa làm cũng không — đó là mục 2.

KHÔNG chứa: tính năng ngoài phạm vi (-> 01-product/overview.md §Non-Goals).
-->

## Đang làm

**Mốc 8 — v2: hot-seat · luật thắng · giao diện · bộ quân** (2026-09-11, nhánh
`feat/v2-hotseat-rule-theme-pieces`). Kế hoạch và trạng thái từng task nằm ở
[`docs/specs/v2/plan.md`](../specs/v2/plan.md) — **đọc file đó trước**, nó có checkbox;
thiết kế ở [`design.md`](../specs/v2/design.md); năm quyết định ở ADR-0024 … ADR-0028.

Đang ở: **code xong, đã nhìn tận mắt, code review xong và đã sửa hết.** 317 unit test · 27 E2E (chạy hai lượt lặp: 54/54). Còn lại: mở PR và đóng nhánh.

**Hai Non-Goal đã được gỡ có chủ đích** (`overview.md` §4): hot-seat, và luật ngoài caro
Việt. Đây là cuộc bàn về phạm vi, không phải một lần bỏ qua tài liệu. Đổi lại §4 nhận một
Non-Goal mới bó chính chế độ vừa mở: hai cái ghế, không tên người chơi, không đồng hồ,
không thống kê riêng.

**Đây là đợt phá cấu trúc lưu duy nhất còn rẻ.** `STORAGE_VERSION` lên `v2`, dữ liệu `v1`
bị bỏ theo ADR-0006 — commit `feat!:`, release major. Lần đổi cấu trúc **kế tiếp** là lần
phải trả nợ migrate, xem §Nợ kỹ thuật.

**Nhánh đã rebase lên `origin/main` mới** (a5b5568 — bản UX persona review của phiên
khác đã vào `main` trong lúc mốc 8 đang làm). Xung đột duy nhất nằm trong khối
`BEGIN:auto` của `docs/README.md`, giải bằng cách chạy lại `docs-regen.sh` — bảng đó
do file sinh ra, nên file là nguồn đúng, không phải bảng.

**Đã xong nhóm 1–7** của [`plan.md`](../specs/v2/plan.md): 308 unit test · 27 E2E ·
typecheck · lint · build tĩnh, tất cả xanh. Còn nhóm 8 (code review, chốt nhánh).

**Bốn lỗi thật chỉ tìm ra bằng cách CHẠY APP, không bằng test** — ghi ra vì cả bốn cùng
một loại, và loại đó không có test nào bắt hộ:

1. **Bàn thụt 56px lúc bắt đầu ván** nên cú bấm đầu vào giữa bàn rơi vào ô (0,−1).
   Nguyên nhân: `SeatBar` chỉ render khi đã vào ván. E2E `play.spec.ts` bắt được. Lần
   chữa đầu (tự đưa camera về giữa khi bàn trống) **vẫn để lọt** ở đường tiếp tục ván đã
   lưu, nơi ván đã có quân trước khi thanh xuất hiện. Chữa đúng là giữ chiều cao bàn
   KHÔNG ĐỔI: thanh luôn chiếm 56px và tự ẩn nội dung.
2. **Nháy sáng khi tải ở chế độ tối** — `useSettings` khởi đầu bằng mặc định `'system'`,
   nên ghost áp giao diện chạy trước lúc cài đặt đọc xong và **xoá** `data-theme` mà
   script trong `<head>` vừa đặt. `NFR-PERF-10` đỏ **một lần trong hai lần chạy**, nên
   một lần chạy xanh không chứng minh được gì — phải `--repeat-each`.
3. **Quân của ghế một tàng hình trên nút đang chọn**: `--mark-one` bằng đúng
   `--ink-strong`, tức đen trên đen. Thấy bằng mắt ở màn bắt đầu.
4. **Thanh hai ghế trải hết cửa sổ ở khổ 1440**, nên vạch chia rơi vào giữa CỬA SỔ chứ
   không giữa BÀN — mất đúng phép so "nửa nào sáng hơn" mà ADR-0028 dựa vào.

Cộng ba thứ nữa cùng loại: pill header in mức khó ở chế độ hot-seat (không có máy nào),
bảng thống kê theo mức hiện ở hot-seat (không ván nào được ghi), và ô bộ quân đang chọn
dùng màu `--focus` — màu của vòng focus bàn phím — làm viền chọn.

**Quả trứng của bộ Vịt phải vẽ lại ba lần.** Hai bản đầu nhọn đỉnh và đọc ra hình lá;
nguyên nhân là điểm điều khiển Bézier cạnh đỉnh đặt lệch khỏi đỉnh nên hai đoạn gặp nhau
thành một góc. Hình đúng hay sai không có cách nào khẳng định bằng code.

**Hai chỗ lệch khỏi mockup đã duyệt, cố ý:** `NoticeLine` được giữ (mockup không vẽ dòng
đó, nhưng bỏ nó là mất phản hồi "Ô đó đã có quân" cho người nhìn bằng mắt), và viền ô bộ
quân đang chọn dùng `--ink-strong` thay cho `--focus` của mockup.

**Một phát hiện ở task 2.4 cần quyết, và nó KHÔNG phải do đợt này gây ra.** Đo
`NFR-PERF-06` cho cả hai luật thì **mức Khó vượt ngân sách 1500ms ở 7/7 lượt, cả hai
luật, cả hai thế bàn**, và chỉ tới độ sâu 5 thay vì 6. Số đầy đủ ở
[`nfr.md`](../02-requirements/nfr.md) §NFR-PERF-06.

Đã chạy **thí nghiệm đối chứng** thay vì đoán: bỏ hẳn phép so sánh `rule === 'blocked'`
ra khỏi `liveSegment`, tức trả dòng nóng về hình dạng trước ADR-0025, rồi đo lại.
`blocked` vẫn 1564ms ở thế bàn yên. Nên tham số luật không phải nguyên nhân — chi phí
của nó nằm dưới mức nhiễu.

**Chưa nới ngân sách, chưa hạ độ sâu.** Cả hai là đổi ngưỡng hoặc đổi sản phẩm dựa trên
một phép đo chưa tách được nguyên nhân giữa "máy này chậm hơn" và "hai thế bàn này nặng
hơn". Việc phải làm trước nằm ở §Việc tiếp theo.

**Bài học về chính cách đo:** phép đo 2026-09-04 ghi con số (1221ms, độ sâu 6) nhưng
**không ghi thế bàn đã dùng**, nên hôm nay không so được với nó. Từ giờ mọi phép đo
hiệu năng phải ghi kèm thế bàn — `nfr.md` §NFR-PERF-06 đã ghi cả hai thế bàn của lần này
dưới dạng tái tạo được.

**Code review (nhóm 8) tìm thêm 8 điểm, đã sửa cả 8.** Hai điểm nặng nhất là lỗi
hành vi thật, và cả hai đều do đợt này gây ra hoặc phơi ra:

1. **Bấm Bỏ ván trong lúc máy đang nghĩ thì MÁY nhận thua.** `giveUp` được viết lại để
   lấy ghế đang đi thay cho `'one'` cố định — đúng cho hot-seat, nhưng ở chế độ đấu máy
   `toMove` đã là ghế của máy ngay sau nước của người, nên màn kết ván ghi "Máy đã bỏ
   ván": người vừa xin thua được hiện là người THẮNG. Đã sửa thành "ghế do NGƯỜI cầm".
2. **Hoàn nước làm ván ĐỨNG HẲN khi máy đi trước.** Chọn "Máy đi trước", máy đánh nước
   đầu, bấm Hoàn → ván trống, lượt của máy, và không ai gọi máy. Lỗi này có từ v1; nó
   chỉ hiện ra vì `undo` vừa được viết lại để nhận `mode`. Đã sửa: gọi lại engine sau
   hoàn nước nếu lượt về ghế của engine.

Sáu điểm còn lại: **luật mặc định trong cài đặt không áp cho ván đầu** sau mỗi lần tải
trang (`StartOverlay` chốt prop vào `useState` trước khi cài đặt đọc xong — cùng loại
lỗi thứ tự khởi động như cú nháy giao diện); **hot-seat phát tiếng THUA khi Người 2
thắng**; **screen reader đọc "quân của máy" ở hot-seat**; `aria-label` trên một `<span>`
trần bị trình duyệt bỏ qua nên số nước đọc ra không có ngữ cảnh; mệnh đề "đưa về giữa
khi bàn trống" **đặt lại cả mức phóng** ở mọi lần resize (đã **bỏ hẳn** — bug nó định
chữa đã được chữa đúng chỗ bằng cách giữ chiều cao `SeatBar` không đổi); và hai bản sao
bảng màu tối trong `globals.css`.

Bản sao bảng màu tối là **bắt buộc** — CSS không gộp được một selector trong `@media`
với một selector ngoài nó. Nên thay vì gộp, đã thêm `src/app/globals.test.ts` đọc chính
file CSS và bắt hai khối phải giống hệt nhau. Nguy cơ lệch âm thầm thành một test đỏ.

Ba lỗi hành vi đã có test riêng, không chỉ có một lần sửa.

**Một phụ thuộc đồng hồ ẨN trong bộ test chiến thuật — đã tìm ra và đã chữa.**

`search.tactics.test.ts` đỏ **hai lần** ở mốc 8, ở **hai ca khác nhau**, cả hai đều ở
~5.2s. Lần đầu tôi ghi là "chưa biết nguyên nhân"; lần thứ hai cho thấy con số 5.2s mới
là dấu vết: đó là **ngưỡng `testTimeout` mặc định 5000ms của vitest**, không phải một
đáp án sai. Vitest KILL test và nó hiện ra y như một ca đỏ.

Đo trên máy rảnh: ca chậm nhất của bộ đó mất **3.0s**, ba ca sau mất 2.6s · 2.2s · 2.0s
— tức chỉ còn ~2s dư. Máy chạy nhiều việc song song là vượt.

Đây đúng là thứ **bất biến 9** cấm: bộ test ghim ĐỘ SÂU chứ không ghim milliseconds, và
`deadlineMs` để 10⁷ms nên hạn giờ của chính `search` không bao giờ nổ — nhưng ngưỡng của
harness thì vẫn là một cái đồng hồ, chỉ là cái đồng hồ không ai viết ra. Đã chữa bằng
`vi.setConfig({ testTimeout: 60_000 })` trong chính file đó, kèm lý do. Nới ngưỡng này
không làm bộ test yếu đi: không ca nào ở đây khẳng định điều gì về thời gian, và ngưỡng
hiệu năng thật là `NFR-PERF-06`, đo riêng.

Bài học: **một ca đỏ "tự xanh khi chạy lại" không phải dao động ngẫu nhiên cho tới khi
biết vì sao.** Lần đầu tôi đã gần như bỏ qua nó.

**Đang chặn:** không có gì.

---

**Áp bộ quy ước code rút từ `quapp-developer-frontend`** (2026-09-11, nhánh
`refactor/code-conventions`). 22 rule nằm ở [`docs/03-design/code-conventions.md`](../03-design/code-conventions.md),
quyết định và phần bị bác nằm ở ADR-0023. Đã xong: tách `views/Home/components/` khỏi
`mains/`, sáu `ghosts/`, gộp JSX xem lại trùng lặp thành `ReviewPane`, barrel
`hooks/index.ts`, bốn luật ESLint mới + `.githooks/pre-commit`.

**Còn nợ của đợt này:** nhãn khối import (R-11) mới áp cho tầng `views/`; `game/` và
`hooks/` chưa. Đó là quy ước thủ công, không script nào ép được — xem §Nợ kỹ thuật.

**Đổi thương hiệu sang `Duck Caro`** (2026-09-08). Repo GitHub đổi từ
`web-game-gomoku` thành `web-game-duck-caro`; GitHub giữ redirect cho URL repo cũ,
nhưng **URL Pages cũ thì không** — địa chỉ chơi giờ là
<https://levananhduc.github.io/web-game-duck-caro/>. **Thư mục local vẫn là**
`web-game-gomoku` — thương hiệu đổi, đường dẫn không, giống cách đã làm ở
`web-game-platformer`. Từ "caro"/"gomoku" ở chỗ nói về *thể loại* được giữ nguyên; chỉ
tên sản phẩm đổi. Khoá `localStorage` (`gomoku:v1:...`) **không** đổi, nếu đổi thì
người đang chơi mất ván đang dở và thống kê.

**Mốc 7 đã xong — hết 7/7 mốc của v1** (2026-09-08). Không thêm chức năng người dùng nào;
mốc này **kiểm** sáu mốc trước và điền con số cuối cùng còn trống trong `nfr.md`.

**19 test E2E Playwright**, chạy trên **bản build tĩnh** chứ không trên dev server
(ADR-0022). Ba thứ 253 unit test không thể thay:

1. **Worker chạy thật.** Mọi test AI đều tiêm một `Engine` giả, nên chưa cái nào chứng
   minh `engine.worker.ts` khởi động được và trả nước trong một trình duyệt thật. Gửi
   sai hình dạng thông điệp thì cả 253 test vẫn xanh và game không đánh được nước nào.
2. **`localStorage` thật** qua một lần tải lại trang thật.
3. **Bàn phím trong cây focus thật** — `NFR-A11Y-02` giờ có đúng cái test E2E mà nó đã hứa.

**`NFR-PERF-09` đã có số, và ngưỡng được chốt SAU khi đo** — đúng thứ tự mà ô đó yêu cầu
từ đầu. Slow 4G + CPU×4, khung 412×915, 5 lần lấy trung vị: **LCP 1.00s · load 3.17s ·
526 kB**, lần nào cũng chơi được ngay. Đo lại được bằng `node e2e/measure-load.mjs --runs 5`.

Hai lần tôi tự đo **sai** trong lát này, ghi ra vì cả hai đều là loại sai âm thầm:

1. **Bắt đầu đếm byte bằng header `content-length`.** Server E2E viết tay không gửi header
   đó, nên phép đo trả về **0 kB** — một con số sai trông y như một con số đúng. Đã chuyển
   sang đếm bằng CDP `Network.loadingFinished`, không phụ thuộc server.
2. **Bắn tất cả phím trong cùng một tick khi thử bàn phím bằng tay** (mốc 6). React batch
   lại, mọi phím dùng cùng một giá trị `cursor` cũ, và tôi suýt kết luận bàn phím hỏng.

**Còn lại sau v1** — xem mục dưới. Thứ duy nhất **không làm được ở đây**, chứ không phải
chưa làm: `NFR-PERF-05` và `NFR-PERF-07` cần một **điện thoại thật**, và không có thiết bị.
Đo trên máy dev một mình đúng là cái mà `overview.md` §6 chỉ tên là chưa đủ.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Tách nguyên nhân `NFR-PERF-06` mức Khó: đo lại trên máy cùng loại với lần 2026-09-04, dùng ĐÚNG hai thế bàn đã ghi trong `nfr.md` | NFR-PERF-06 · ADR-0014 | cao | Đây là ngưỡng duy nhất đang KHÔNG ĐẠT mà đã có số. Không tách được nguyên nhân thì mọi cách chữa — nới ngân sách, hạ độ sâu, quay lại transposition table — đều là chữa một thứ chưa ai biết là gì |
| Đo `NFR-PERF-05` và `NFR-PERF-07` trên một điện thoại thật | NFR-PERF-05 · NFR-PERF-07 | cao | Bàn vô hạn là rủi ro hiệu năng lớn nhất. `NFR-PERF-07` giờ cũng đo được: worker đã chạy thật, còn thiếu một lần mở Performance panel xác nhận không có long task |
| Xem chế độ tối tận mắt ở cả bốn khổ | NFR-A11Y-01 | thấp | Token đã đúng; còn thiếu một lần nhìn |
| Nghe thật bốn tiếng bằng tai | FR-14 | thấp | Đếm được oscillator, nhưng "nghe có hợp không" thì không chứng minh được bằng code — ADR-0021 đã ghi sẵn giới hạn này |
| Tự chơi thử có ghi kết quả để kiểm "mức khó phân tách thật" | overview.md §6 | trung bình | Tiêu chí thành công số 1 của sản phẩm, và chưa ai đo. Cần người chơi thật, không phải test |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `game/ai` chưa có transposition table | AI search lại thế bàn đã tính | Điều kiện kích hoạt cũ đã nổ và **phép đo bác bỏ cách chữa**: chi phí ở xếp hạng ứng viên mỗi nút, không ở thế bàn trùng lặp. Thu hẹp bề rộng giải xong (ADR-0014) | Điều kiện MỚI: sau khi hàm lượng giá được viết lại cho rẻ đi — lúc đó số nút/giây tăng và thăm lại thế bàn mới thành phần đáng kể |
| `ai/patterns.ts` dựng chuỗi ký tự rồi tra regex cho mỗi hướng, mỗi ứng viên, mỗi nút | Đây là chỗ tốn gần như toàn bộ thời gian search (~1ms một nút) | Đã đủ để `NFR-PERF-06` đạt sau khi thu hẹp bề rộng. Tối ưu thêm bây giờ là tối ưu thứ chưa ai đo là thiếu | Khi cần độ sâu hơn 6, hoặc khi bề rộng 10/5 tỏ ra bỏ sót đòn hay |
| `core/game.applyMove` dựng lại bàn mỗi lần gọi — `O(n)` mỗi nước | Vài chục nghìn phép chèn Map cho một ván dài | **Chưa đo thấy**, và tối ưu trước khi đo là thêm phức tạp đổi lấy một con số chưa ai thấy | Khi đo `NFR-PERF-05` thấy nó xuất hiện trong profile |
| `.github/workflows/ci.yml` — bước `yarn audit` có `|| true` | Lỗ hổng mức high không làm đỏ CI, chỉ hiện trong log | Yarn classic không có cờ lọc theo mức để chặn đúng ngưỡng của `NFR-SEC-05` | Khi chuyển sang một trình audit chặn được theo mức, hoặc khi có lỗ hổng high thật |
| Ván **hot-seat không vào thống kê** (FR-12 vẫn ba ô theo mức khó) | Chơi hai người bao nhiêu ván cũng không để lại dấu vết nào | Không mức khó nào đúng cho một ván không có máy tham gia, và `overview.md` §4 đã ghi "không thống kê riêng cho hot-seat" là Non-Goal | Khi có người hỏi "tôi thắng bạn tôi mấy ván" — lúc đó nó là một tính năng, không phải một ô còn thiếu |
| Ván đấu máy ở luật `free` **đổ chung ô** với luật `blocked` (ADR-0025) | Con số thống kê trộn hai luật, nên nó không đo được "mức khó phân tách thật" của `overview.md` §6 nữa | Tách theo luật là 6 ô, phải dựng lại cả màn thống kê trong một đợt đã chạm 25 file | Ngay trước lần đo tiêu chí thành công số 1 của sản phẩm — phép đo đó cần ô sạch |
| Dữ liệu lưu không migrate giữa các version khoá (ADR-0006) | Đổi cấu trúc lưu là mất ván đang chơi và mất thống kê | v1 chưa có người chơi thật để mất dữ liệu | Ngay trước lần đổi cấu trúc lưu đầu tiên sau khi game có người chơi thật |
| ADR-0002 và ADR-0007 mang chữ đã lỗi (`Stone`, "giao điểm") | Người đọc hai ADR đó phải đọc kèm ADR-0009 | `decisions/README.md` quy định ADR `accepted` là append-only. Một bản ghi sửa được thì không còn là bản ghi | Không bao giờ — đây là cái giá cố định của append-only, ghi ở đây để không ai "dọn" nó |
| Resize cửa sổ có thể đẩy thế trận ra ngoài khung nhìn | Người chơi phải bấm "Giữa" để thấy lại. **Nút đó phải có MỌI CHẾ ĐỘ** — mốc 5 từng ẩn nó trong chế độ xem lại và làm người chơi mắc kẹt | Tự dịch khung nhìn khi resize là giật màn hình của người đang chơi — cái đó tệ hơn | Nếu người chơi phản hồi rằng bàn "biến mất" sau khi quay ngang máy |
| Nhãn khối import (R-11) mới áp cho `src/views/`, chưa áp cho `src/game/` và `src/hooks/` | Nửa codebase có nhãn, nửa không | Áp hết là chạm ~50 file chỉ để thêm comment, trong cùng một commit refactor đã chạm 25 file — lẫn hai loại thay đổi vào nhau thì review không còn đọc được. R-11 cũng là rule THỦ CÔNG, không luật lint nào giữ được nó | Khi thêm `eslint-plugin-import` với `import/order` — lúc đó máy áp một lần cho cả cây, và nhãn chữ thành thừa |
