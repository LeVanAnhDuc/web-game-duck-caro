# ADR-0018 · Hàng danh sách nước đi cao 44px khi bấm được, 32px khi chỉ để đọc

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-08 · FR-09 · NFR-A11Y-03

## 1. Bối cảnh

`MASTER.md` §8 định nghĩa `.move-row` với `min-height: 32px`. `MASTER.md` §10 (checklist
bắt buộc) ghi "Mọi nút thật ≥ 44×44px". Hai câu này mâu thuẫn, nhưng chưa bao giờ đụng
nhau vì cho tới mốc 4 chưa có gì trong danh sách bấm được — nó chưa tồn tại.

FR-09 làm hàng danh sách thành nút lần đầu. Trên khổ 375 danh sách nằm trong bottom sheet,
đúng chỗ ngón tay cái, nên 32px là vấn đề thật chứ không phải vấn đề trên giấy.

## 2. Quyết định

Chiều cao hàng phụ thuộc vai trò của nó, không phụ thuộc khổ màn:

- Hàng **chỉ để đọc** (khi đang chơi): 32px, giữ nguyên `MASTER.md` §8.
- Hàng **bấm được** (chế độ xem lại): 44px, cùng với `cursor: pointer` và
  `aria-current="true"` cho hàng đang xem.

`MASTER.md` §8 được cập nhật trong cùng nhánh này để nói cả hai con số. Design system
không được để lại một con số duy nhất khi thực tế có hai vai trò.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| 44px ở mọi nơi | Một con số, không có ngoại lệ để hiểu sai. Nhưng cột phải desktop tụt từ ~13 nước xuống ~9 nước một màn, làm mất chính cái mà danh sách sinh ra để có: nhìn được nhiều nước cùng lúc. |
| Giữ 32px, coi hàng là "lối tắt" chứ không phải nút, vì đã có bốn nút tua ‹ › đủ 44px | Lập luận này đứng được, nhưng nó biến một quy tắc a11y đo được thành một phán đoán về ý định. Và trên 375, hàng bấm được lại đúng là đường đi tự nhiên nhất. |
| Giữ 32px trên desktop, 44px trên mobile | Cùng một component có hai chiều cao theo khổ màn là thứ sẽ bị chép sai ở lần dùng thứ ba. Vai trò là tiêu chí ổn định hơn khổ màn. |

## 4. Hệ quả

**Được:**
- NFR-A11Y-03 đạt ở đúng chỗ nó quan trọng, không phải đạt trên toàn bộ bằng cách hy sinh
  mật độ ở chỗ không cần.
- `MASTER.md` hết mâu thuẫn nội tại.

**Mất / phải chấp nhận:**
- Cùng một component có hai chiều cao, nên phải có một prop điều khiển và phải test cả
  hai nhánh. Người đọc code lần đầu sẽ hỏi vì sao — đó là lý do ADR này tồn tại.
- Trong chế độ xem lại, số nước thấy cùng lúc giảm: cột phải desktop 19 → 14, sheet 375
  5 → 4.

**Điều kiện xem lại quyết định này:** nếu bàn phím (FR-15, mốc 6) trở thành đường đi chính
để nhảy nước, lúc đó chiều cao hàng không còn là vùng bấm nữa và 32px có thể quay lại.
