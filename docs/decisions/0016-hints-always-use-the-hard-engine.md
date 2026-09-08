# ADR-0016 · Gợi ý luôn tính bằng engine mức Khó, không theo mức đang chơi

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-10 · FR-05 · NFR-PERF-06 · ADR-0005 · ADR-0015

## 1. Bối cảnh

Nút "Gợi ý" đã có chỗ trong `Controls` từ mốc 1 (disabled). Khi hiện thực nó ở mốc 5,
câu hỏi là gợi ý nên mạnh cỡ nào. Có ba mức khó, và mức Dễ được làm yếu bằng **mù có
chủ đích** — engine bỏ qua một phần đe doạ và hàm lượng giá cũng bị làm mù theo
(ADR-0005, ADR-0015). Nghĩa là ở mức Dễ, "nước engine chọn" không phải "nước tốt".

## 2. Quyết định

Gợi ý luôn gọi `engine.bestMove(moves, 'human', 'hard')`, bất kể người chơi đang ở mức
nào. Mức khó của ván chỉ quyết định đối thủ, không quyết định người trợ giúp.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Gợi ý theo đúng mức đang chơi | Ở mức Dễ nó trả về một nước cố ý dở. Một gợi ý dở tệ hơn không có gợi ý: người chơi tin nó, đánh theo, rồi thua vì nó. |
| Cố định mức Thường cho mọi gợi ý | Nhanh (118ms) và vẫn tử tế, nhưng người chơi mức Khó xin gợi ý sẽ nhận nước yếu hơn chính đối thủ họ đang đánh — vô lý ở đúng lúc họ cần nhất. |
| Một mức "phân tích" riêng, sâu hơn cả Khó | Ngân sách thời gian sẽ vượt NFR-PERF-06, và phải bảo trì một cấu hình engine thứ tư mà không FR nào yêu cầu. |

## 4. Hệ quả

**Được:**
- Gợi ý có một nghĩa duy nhất ở mọi mức: "nước tốt nhất mà engine này tìm được".
- Không thêm cấu hình engine nào; `levels.ts` giữ nguyên ba mức.

**Mất / phải chấp nhận:**
- Gợi ý tốn ~1.2s kể cả khi đang chơi mức Dễ (vốn trả nước trong 8ms). Nút phải có
  trạng thái đang-nghĩ, nếu không người chơi tưởng máy treo.
- Người chơi mức Dễ có thể dùng gợi ý để chơi ở trình mức Khó. Chấp nhận: thống kê là
  của chính người chơi, không có bảng xếp hạng nào để gian lận (`overview.md` §Non-Goals).

**Điều kiện xem lại quyết định này:** khi có chế độ thi đấu hoặc bảng xếp hạng — lúc đó
"gợi ý mạnh hơn đối thủ" thành một lỗ hổng, không còn là tiện ích.
