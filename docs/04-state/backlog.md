# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-03 · commit —
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

**Mốc 4 đã xong** (2026-09-04). Ván dở sống qua một lần tải lại trang, và thống kê tách
riêng theo từng mức khó. 160 unit test xanh; `typecheck` · `lint` · `build` đều qua; đã
thử tay đủ sáu luồng trên app đang chạy, kể cả hai luồng dễ bị bỏ sót:

- **Ván lưu đang ở lượt máy** → mở lại trang thì máy tự nghĩ và đánh tiếp (3 → 4 nước).
- **Ván lưu hỏng** (hai nước cùng một ô — đúng kiểu dữ liệu, sai luật chơi) → app còn
  sống, ván đó bị xoá để lần sau không thử lại. Khoá version cũ (`v0`) bị bỏ qua hoàn
  toàn, không migrate (ADR-0006).

Hai thứ tự quyết trong lát này, cả hai đều là chỗ **sai âm thầm**:

1. **`game/storage` cố ý KHÔNG biết luật chơi.** Nó chỉ kiểm hình dạng dữ liệu; ván sai
   luật do `hooks` bắt qua `core/game.replay`, vốn ném. `resume` trả `false` chứ không
   ném tiếp — ván lưu hỏng được phép làm mất ván đó, không được phép làm vỡ app.
2. **Ghi thống kê có khoá chống đếm trùng.** `useEffect` theo `status` chạy lại mỗi lần
   render có `status` mới, và một ván kết thúc còn render nhiều lần nữa khi người chơi
   resize hoặc kéo bàn. Không có khoá thì một ván thắng đếm thành ba — vẫn ra số, chỉ là
   số sai. Đã thử: 8 lượt resize + kéo sau khi kết ván, thống kê vẫn đúng 1.

Cũng sửa trong lượt này, lỗi tìm ra bằng cách **bấm thật**: "Chơi lại" chỉ mở lại màn
chọn mức mà không dọn `status`, nên cột phải hiện đồng thời màn chọn mức VÀ khối "Bạn đã
bỏ ván · nước 6 · Chơi lại" của ván trước. Thêm `resetToMenu()`.

**Dừng ở bước:** tiếp theo là mốc 5 — lịch sử nước đi, xem lại ván, gợi ý. Chỗ trống
chờ sẵn trong cột phải đã có từ mốc 3.

**Đang chặn:** không có gì.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Đo `NFR-PERF-05` và `NFR-PERF-07` trên một điện thoại thật | NFR-PERF-05 · NFR-PERF-07 | cao | Bàn vô hạn là rủi ro hiệu năng lớn nhất. `NFR-PERF-07` giờ cũng đo được: worker đã chạy thật, còn thiếu một lần mở Performance panel xác nhận không có long task |
| **Mốc 5** — lịch sử nước đi, xem lại ván, gợi ý | FR-08 · FR-09 · FR-10 | cao | Đều đi trên `moves` đã có từ mốc 1. Danh sách nước đi có chỗ trống chờ sẵn trong cột phải |
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
| Resize cửa sổ có thể đẩy thế trận ra ngoài khung nhìn | Người chơi phải bấm "Giữa" để thấy lại | Tự dịch khung nhìn khi resize là giật màn hình của người đang chơi — cái đó tệ hơn | Nếu người chơi phản hồi rằng bàn "biến mất" sau khi quay ngang máy |
