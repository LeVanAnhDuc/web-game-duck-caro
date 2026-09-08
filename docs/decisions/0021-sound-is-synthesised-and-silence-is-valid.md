# ADR-0021 · Âm thanh tổng hợp bằng WebAudio, và im lặng là một trạng thái hợp lệ

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-14 · NFR-SEC-07 · NFR-REL-04 · NFR-PERF-08 · US-01

## 1. Bối cảnh

FR-14 ghi "âm thanh tổng hợp bằng WebAudio, không file" ngay trong tên chức năng, nhưng
chưa ADR nào nói vì sao, và chưa ai chốt app phải làm gì khi trình duyệt chặn âm thanh.

Ràng buộc thật: `NFR-SEC-07` đòi **không một request mạng nào** sau lần tải đầu. Một file
`.mp3` hay `.wav` là một request — kể cả khi nó nằm cùng origin.

## 2. Quyết định

`game/audio/` tổng hợp bốn tiếng bằng `OscillatorNode` + `GainNode`: `place`, `reply`,
`win`, `lose`. Người chơi và máy phân biệt bằng **cao độ**, không bằng âm lượng.

`AudioContext` được tạo ở **cử chỉ người dùng đầu tiên**, không phải lúc mount. Không tạo
được, hoặc `AudioContext` không tồn tại → module trả về một bản **không làm gì**. Người
gọi không bao giờ nhận `null` và không bao giờ phải kiểm.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| File âm thanh nhúng dạng data URI trong bundle | Không có request mạng nên vẫn thoả NFR-SEC-07 — nhưng bốn tiếng ngắn ở dạng base64 tốn hàng chục kB trong First Load JS, và `NFR-PERF-08` chỉ còn ~34 kB dư. Đổi ngân sách tải cho một tiếng click là đổi sai chỗ. |
| Trả `null` khi không tạo được context, để người gọi tự kiểm | Mỗi chỗ gọi thành một `if`. Bốn tiếng nhân nhiều chỗ gọi là nhiều cơ hội quên một chỗ, và chỗ quên đó **nổ** thay vì im. |
| Tạo `AudioContext` lúc mount rồi `resume()` sau | Context tạo trước cử chỉ nằm ở `suspended`, và ở nhiều trình duyệt **không bao giờ** resume được. Kết quả là im lặng vĩnh viễn mà không lỗi nào nổ ra — đúng loại sai âm thầm tệ nhất. |
| Dựng `AudioBuffer` sẵn rồi phát qua `<audio>` | Vẫn cần buffer từ đâu đó, và không rẻ hơn oscillator. |

## 4. Hệ quả

**Được:**

- Không byte tài sản nào, không request nào. `NFR-SEC-07` đạt bằng thiết kế.
- `journeys.md` §US-01 "trình duyệt chặn âm thanh — phải im lặng, không được vỡ" thành
  hành vi mặc định, không phải một nhánh xử lý lỗi.

**Mất / phải chấp nhận:**

- Tiếng nghe "điện tử", không phải tiếng bút gõ giấy thật. Không khớp hoàn hảo với hướng
  thẩm mỹ giấy ô li của `MASTER.md` §0 — chấp nhận, vì hướng đó nói về THỊ GIÁC.
- Không có cách nào khẳng định "âm thanh đã phát" trong unit test; test chỉ kiểm được
  module **không ném** và có gọi đúng số lần. Việc nghe thật vẫn phải làm bằng tai.

**Điều kiện xem lại quyết định này:** nếu ngân sách First Load JS được nâng đáng kể, hoặc
nếu người chơi phản hồi rằng tiếng tổng hợp làm game rẻ đi.
