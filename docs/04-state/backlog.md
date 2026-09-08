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

**Mốc 5 đã xong** (2026-09-08). Danh sách nước đi, xem lại ván đã kết thúc, và gợi ý.
196 unit test xanh (17 file); `typecheck` · `lint` · `build` đều qua. First Load JS **116 kB**,
còn dưới ngưỡng 150 kB của NFR-PERF-08.

Quyết định chịu lực của mốc này: **xem lại là một PHÉP CHIẾU, không phải một trạng
thái song song.** Cả chế độ tốn đúng một số — `reviewAt` — và bàn hiển thị là
`moves.slice(0, reviewAt)`. Không có `GameState` thứ hai, nên không có gì để lệch với
nguồn đúng (bất biến 1). `game/core` không đổi một dòng nào — đó cũng là phép thử nhanh
xem thiết kế này còn đúng: task nào cần sửa `core/game.ts` là dấu hiệu đã sai ở đâu đó.

Ba ADR mới. ADR-0016 (gợi ý luôn hỏi mức Khó) là lựa chọn thiết kế; hai cái còn lại ghi
**hai lỗi mà mốc 5 làm LỘ RA chứ không tạo ra**:

- **ADR-0017** — nút "Đánh" đặt cứng ở `left + cell + 8`, tức 8px vào trong ô kế bên, nên
  ô đó có quân thì nút che mất quân. Trước đây hiếm gặp vì chuột không tạo quân xem
  trước (ADR-0007); gợi ý làm nó xuất hiện trên mọi thiết bị.
- **ADR-0018** — `MASTER.md` §8 (32px) và §10 (≥44px) mâu thuẫn ở đúng component vừa trở
  thành nút lần đầu.

Hai lỗi nữa tìm ra bằng cách **bấm thật trên app đang chạy**, không test nào bắt được:

1. **Chế độ xem lại ẩn `Controls`, nên nó đã lấy mất van an toàn của một món nợ có ý.**
   Bảng §Nợ kỹ thuật chấp nhận việc resize đẩy thế trận ra ngoài khung nhìn *vì có nút
   "Giữa" để thoát*. Đổi 1440 → 375 trong lúc xem lại thì bàn trống trơn và không có
   đường ra. Đã thêm "Giữa" vào `ReviewBar`, và vào xem lại thì tự đưa khung nhìn về cả ván.
2. **`<button>` mặc định `text-align: center`, `<div>` thì không** — nên hàng đổi từ chỉ-đọc
   sang bấm-được làm cả cột toạ độ nhảy sang phải ~70px.

**Chưa kiểm được trong lát này:** canvas ở chế độ tối. Phần DOM đúng palette §2, nhưng
canvas chỉ đọc lại palette khi `prefers-color-scheme` **thật** đổi, nên đặt biến CSS
bằng JS không kích hoạt nó. Việc "xem chế độ tối tận mắt" vẫn còn nguyên ở mục dưới.

**Dừng ở bước:** tiếp theo là mốc 6 — con trỏ bàn phím + `aria-live` đầy đủ, âm thanh,
cài đặt. `drawCursorRing` đã có từ mốc 3, chưa ai gọi.

**Đang chặn:** không có gì.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Đo `NFR-PERF-05` và `NFR-PERF-07` trên một điện thoại thật | NFR-PERF-05 · NFR-PERF-07 | cao | Bàn vô hạn là rủi ro hiệu năng lớn nhất. `NFR-PERF-07` giờ cũng đo được: worker đã chạy thật, còn thiếu một lần mở Performance panel xác nhận không có long task |
| Mốc 6 — con trỏ bàn phím + `aria-live` đầy đủ, âm thanh, cài đặt | FR-14 · FR-15 · FR-16 | trung bình | `NFR-A11Y-02` không đạt tới khi mốc này xong. `drawCursorRing` đã có, chưa ai gọi |
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
