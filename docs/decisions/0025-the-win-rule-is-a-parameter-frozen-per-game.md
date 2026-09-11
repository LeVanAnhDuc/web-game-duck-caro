# ADR-0025 · Luật thắng là một tham số, đông cứng theo từng ván, và engine phải biết nó

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-18 · US-05 · NFR-PERF-06 · ADR-0003 · ADR-0015

## 1. Bối cảnh

ADR-0003 chốt đúng **một** luật: năm quân liền là thắng, trừ khi bị chặn cả hai đầu.
FR-18 muốn thêm lựa chọn luật tự do (chặn hai đầu vẫn thắng). `overview.md` §Non-Goals
từng cấm điều này; Non-Goal đó đã được gỡ có chủ đích cùng ngày.

Về mặt code phần thắng/thua nhỏ đến bất ngờ: `winningLine` đang xét `run.cells.length >=
WIN_LENGTH && run.openEnds > 0`, và luật tự do chỉ là bỏ vế thứ hai. **Cách xét trên
đoạn cực đại vẫn đúng cho cả hai luật** — bất biến 3 không bị phá, nó chỉ được tham số hoá.

Cái không nhỏ là hai thứ khác: luật thuộc về đâu, và engine có biết luật không.

## 2. Quyết định

**Luật là `Rule = 'blocked' | 'free'`, và nó thuộc về VÁN, không thuộc về cài đặt.**
`SavedGame` mang `rule`; `settingsStore` chỉ giữ `defaultRule` để điền sẵn vào màn bắt
đầu, đúng cách `defaultLevel` đang làm với `level`. Luật được chọn khi bắt đầu ván và
không đổi được giữa ván.

**Engine được dạy đủ.** `rule` đi kèm `moves` trong mỗi thông điệp gửi worker (bất biến 6),
và nó đi tới tận `patterns.ts` / `evaluate.ts`, không dừng ở `rules.ts`. Ở luật tự do,
một đoạn năm quân bị chặn hai đầu là một đòn thắng thật, nên bảng mẫu phải chấm nó là
thắng — nếu không, engine bỏ lỡ đòn thắng của chính nó và không chặn đòn thắng của đối thủ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Luật nằm trong `settingsStore` | Mở lại một ván lưu sau khi đổi cài đặt sẽ cho **kết quả khác** trên cùng một chuỗi nước. Đúng loại sai âm thầm mà `invariants.md` tồn tại để chặn |
| Chỉ `rules.ts` biết luật, bảng mẫu giữ nguyên caro Việt | Rẻ hơn nhiều và **đã bị bác**: engine sẽ đánh giá một đoạn năm bị chặn là vô hại trong khi nó là thua ngay. ADR-0015 đã dạy đúng bài này một lần — mù ở hàm lượng giá là mù thật |
| Luật tự do chỉ cho hot-seat, đấu máy không được chọn | Không phải dạy engine, không phải đo lại. Nhưng nó lấy mất lựa chọn của đúng nhóm người dùng chính (`overview.md` §3 nói nhóm chính chơi một mình) |
| Tách thành hai hàm `winningLineBlocked` / `winningLineFree` | Hai bản sao của cùng một phép quét đoạn cực đại. Bản thứ hai sẽ lệch khỏi bản thứ nhất ở lần sửa tiếp theo |

## 4. Hệ quả

**Được:**

- Bất biến 3 giữ nguyên hình dạng: vẫn là đoạn cực đại, chỉ thêm một tham số.
- Một ván lưu luôn được xử đúng bằng luật nó sinh ra, kể cả nhiều tháng sau.
- Engine chơi đúng ở cả hai luật, nên mức khó vẫn có nghĩa ở cả hai.

**Mất / phải chấp nhận:**

- `NFR-PERF-06` phải **đo lại cho cả hai luật**. `patterns.ts` là chỗ tốn gần như toàn
  bộ thời gian search (`backlog.md` §Nợ kỹ thuật), nên thêm một nhánh vào đó là chạm
  đúng điểm nóng. Con số cũ chỉ còn nói về luật `blocked`.
- `SavedGame` thêm một trường → cùng lần lên `v2` của ADR-0024.
- **Thống kê trộn hai luật.** FR-12 vẫn chỉ có ba ô theo mức khó, nên một ván thắng ở
  luật tự do đổ chung ô với luật caro Việt. Đã ghi vào `backlog.md` §Nợ kỹ thuật —
  đây là lựa chọn có ý thức để không phải dựng lại cả màn thống kê trong đợt này.

**Điều kiện xem lại quyết định này:** khi có luật thứ ba (renju, luật cấm cho quân đi
trước) — lúc đó `Rule` không còn là một cặp và bảng mẫu cần một tầng cấu hình thật, chứ
không phải thêm một nhánh `if` nữa.
