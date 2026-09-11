# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-11 · commit —
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

**Đang chặn:** không có gì.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
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
| ~~`ci.yml` — bước `yarn audit` có `|| true`~~ **đã trả** (2026-09-08) | — | Thay bằng job `dependencies` dùng `actions/dependency-review-action`, chặn được theo mức `high` | — |
| Dữ liệu lưu không migrate giữa các version khoá (ADR-0006) | Đổi cấu trúc lưu là mất ván đang chơi và mất thống kê | v1 chưa có người chơi thật để mất dữ liệu | Ngay trước lần đổi cấu trúc lưu đầu tiên sau khi game có người chơi thật |
| ADR-0002 và ADR-0007 mang chữ đã lỗi (`Stone`, "giao điểm") | Người đọc hai ADR đó phải đọc kèm ADR-0009 | `decisions/README.md` quy định ADR `accepted` là append-only. Một bản ghi sửa được thì không còn là bản ghi | Không bao giờ — đây là cái giá cố định của append-only, ghi ở đây để không ai "dọn" nó |
| Resize cửa sổ có thể đẩy thế trận ra ngoài khung nhìn | Người chơi phải bấm "Giữa" để thấy lại. **Nút đó phải có MỌI CHẾ ĐỘ** — mốc 5 từng ẩn nó trong chế độ xem lại và làm người chơi mắc kẹt | Tự dịch khung nhìn khi resize là giật màn hình của người đang chơi — cái đó tệ hơn | Nếu người chơi phản hồi rằng bàn "biến mất" sau khi quay ngang máy |
| Nhãn khối import (R-11) mới áp cho `src/views/`, chưa áp cho `src/game/` và `src/hooks/` | Nửa codebase có nhãn, nửa không | Áp hết là chạm ~50 file chỉ để thêm comment, trong cùng một commit refactor đã chạm 25 file — lẫn hai loại thay đổi vào nhau thì review không còn đọc được. R-11 cũng là rule THỦ CÔNG, không luật lint nào giữ được nó | Khi thêm `eslint-plugin-import` với `import/order` — lúc đó máy áp một lần cho cả cây, và nhãn chữ thành thừa |
