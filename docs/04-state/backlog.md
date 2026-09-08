# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
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

**Mốc 6 đã xong** (2026-09-08). Bàn phím, âm thanh, cài đặt. 253 unit test xanh (22 file);
`typecheck` · `lint` · `build` đều qua. First Load JS **118 kB**, còn dưới ngưỡng 150 kB.

**`NFR-A11Y-02` ĐẠT LẦN ĐẦU.** Đây là ngưỡng duy nhất trong `nfr.md` mà năm mốc đầu không hề
đạt: bàn là canvas, và canvas không có gì để tab tới. Tức là tới hết mốc 5, game này
**không chơi được nếu không có chuột hoặc cảm ứng**.

Đã thử trên **bản build tĩnh**, không phải dev server — và đó là một bài học: overlay
dev-tools của Next là một phần tử trong thứ tự Tab, nên đo a11y trên dev server là đo một
cây focus không tồn tại ở production. Chuỗi đã chạy thật: mũi tên → Shift+mũi tên →
Enter → Enter → `u` (hoàn) → `h` (gợi ý), và vùng live đọc đúng cả toạ độ lẫn tình
trạng ô.

Ba ADR mới:

- **ADR-0019** — cài đặt có seam riêng. `GameRepository.ts` đã ghi từ mốc 4 rằng cài đặt
  không thuộc về nó, nhưng bất biến 5 lại cấm UI gọi `localStorage`. Hai câu đó chỉ cùng
  đúng khi có **hai** seam — bất biến 5 đã được viết lại cho khớp, nếu không nó tự thành
  câu sai.
- **ADR-0020** — mũi tên dịch con trỏ, Shift + mũi tên kéo bàn. Loại phương án "chế độ
  kéo bàn riêng": trạng thái ẩn, và trên bàn vô hạn thì không biết mình đang ở chế độ nào
  nghĩa là mỗi phím mũi tên làm một trong hai việc hoàn toàn khác nhau.
- **ADR-0021** — âm thanh tổng hợp, và **im lặng là trạng thái hợp lệ**. `AudioContext` sinh
  ra ở tiếng ĐẦU TIÊN chứ không lúc mount: context tạo trước cử chỉ người dùng nằm ở
  `suspended` vĩnh viễn ở nhiều trình duyệt — im lặng mãi mãi mà không lỗi nào nổ ra.

Hai lỗi tìm ra bằng cách **nhìn thật**, không test nào bắt được:

1. **Sheet cài đặt lơ lửng giữa màn ở desktop.** Nó nằm trong khung BÀN, nên `right-0` neo
   vào mép bàn chứ không mép cửa sổ. Đổi sang `lg:fixed`.
2. **Trong lúc đo `NFR-SEC-07`**, phát hiện câu chữ của ngưỡng đó quá chặt so với thực
   tế: chunk của Worker (`953.js`) tải sau lần đầu. Cùng origin, là code của chính app.
   Đã viết lại ngưỡng thành "không request nào RA NGOÀI origin", và ghi số đo thật.

**Chưa kiểm được:** nghe thật bốn tiếng bằng tai. Đã xác nhận được **2 oscillator thật**
sinh ra cho một nước của người cộng một nước của máy, nhưng "nghe có hay không" thì
không chứng minh được bằng code (ADR-0021 đã ghi sẵn điều này). Canvas ở chế độ tối cũng
vẫn chưa xem tận mắt.

**Dừng ở bước:** tiếp theo là mốc 7 — E2E Playwright và đo `NFR-PERF-09`.

**Đang chặn:** không có gì.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Đo `NFR-PERF-05` và `NFR-PERF-07` trên một điện thoại thật | NFR-PERF-05 · NFR-PERF-07 | cao | Bàn vô hạn là rủi ro hiệu năng lớn nhất. `NFR-PERF-07` giờ cũng đo được: worker đã chạy thật, còn thiếu một lần mở Performance panel xác nhận không có long task |
| Mốc 7 — E2E Playwright và đo `NFR-PERF-09` | NFR-PERF-09 | trung bình | Workflow deploy đã có (ADR-0010); còn thiếu E2E và một lần chạy Lighthouse. E2E cần RNG seed được, đã có từ mốc 2 |
| Xem chế độ tối tận mắt ở cả bốn khổ | NFR-A11Y-01 | thấp | Token đã đúng; còn thiếu một lần nhìn |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `game/ai` chưa có transposition table | AI search lại thế bàn đã tính | Điều kiện kích hoạt cũ đã nổ và **phép đo bác bỏ cách chữa**: chi phí ở xếp hạng ứng viên mỗi nút, không ở thế bàn trùng lặp. Thu hẹp bề rộng giải xong (ADR-0014) | Điều kiện MỚI: sau khi hàm lượng giá được viết lại cho rẻ đi — lúc đó số nút/giây tăng và thăm lại thế bàn mới thành phần đáng kể |
| `ai/patterns.ts` dựng chuỗi ký tự rồi tra regex cho mỗi hướng, mỗi ứng viên, mỗi nút | Đây là chỗ tốn gần như toàn bộ thời gian search (~1ms một nút) | Đã đủ để `NFR-PERF-06` đạt sau khi thu hẹp bề rộng. Tối ưu thêm bây giờ là tối ưu thứ chưa ai đo là thiếu | Khi cần độ sâu hơn 6, hoặc khi bề rộng 10/5 tỏ ra bỏ sót đòn hay |
| `core/game.applyMove` dựng lại bàn mỗi lần gọi — `O(n)` mỗi nước | Vài chục nghìn phép chèn Map cho một ván dài | **Chưa đo thấy**, và tối ưu trước khi đo là thêm phức tạp đổi lấy một con số chưa ai thấy | Khi đo `NFR-PERF-05` thấy nó xuất hiện trong profile |
| `.github/workflows/ci.yml` — bước `yarn audit` có `|| true` | Lỗ hổng mức high không làm đỏ CI, chỉ hiện trong log | Yarn classic không có cờ lọc theo mức để chặn đúng ngưỡng của `NFR-SEC-05` | Khi chuyển sang một trình audit chặn được theo mức, hoặc khi có lỗ hổng high thật |
| Dữ liệu lưu không migrate giữa các version khoá (ADR-0006) | Đổi cấu trúc lưu là mất ván đang chơi và mất thống kê | v1 chưa có người chơi thật để mất dữ liệu | Ngay trước lần đổi cấu trúc lưu đầu tiên sau khi game có người chơi thật |
| ADR-0002 và ADR-0007 mang chữ đã lỗi (`Stone`, "giao điểm") | Người đọc hai ADR đó phải đọc kèm ADR-0009 | `decisions/README.md` quy định ADR `accepted` là append-only. Một bản ghi sửa được thì không còn là bản ghi | Không bao giờ — đây là cái giá cố định của append-only, ghi ở đây để không ai "dọn" nó |
| Resize cửa sổ có thể đẩy thế trận ra ngoài khung nhìn | Người chơi phải bấm "Giữa" để thấy lại. **Nút đó phải có MỌI CHẾ ĐỘ** — mốc 5 từng ẩn nó trong chế độ xem lại và làm người chơi mắc kẹt | Tự dịch khung nhìn khi resize là giật màn hình của người đang chơi — cái đó tệ hơn | Nếu người chơi phản hồi rằng bàn "biến mất" sau khi quay ngang máy |
