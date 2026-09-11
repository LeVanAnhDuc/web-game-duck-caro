# ADR-0027 · Một bộ quân là một cặp HÌNH; màu quân không đổi theo bộ

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-20 · US-06 · NFR-A11Y-01 · ADR-0008 · ADR-0019

## 1. Bối cảnh

FR-20 cho người chơi đổi bộ quân. Nghe như một tính năng trang trí, nhưng nó chạm thẳng
vào chỗ ADR-0008 đặt toàn bộ khả năng tiếp cận của sản phẩm: **hình mang thông tin
"quân của ai", màu chỉ là lớp dư thừa.** Một tính năng đổi hình mà làm hỏng nguyên tắc
đó thì phá đúng cái cột chịu lực của palette.

Thêm hai ràng buộc đo được: `NFR-A11Y-01` bắt quân đạt ≥ 3:1 với nền bàn, và ô trên điện
thoại mặc định chỉ 28px (`MASTER.md` §6) — hình phải đọc được ở cỡ đó, không phải ở cỡ
tile trong màn cài đặt.

## 2. Quyết định

Một bộ quân là **một cặp hình vẽ bằng canvas path**, và chỉ có thế. Bốn bộ:

| Bộ | Ghế một | Ghế hai |
| --- | --- | --- |
| Bút chì *(mặc định, giữ nguyên v1)* | ✕ hai nét chéo | ◯ vòng tròn |
| Đặc/rỗng | ● chấm đặc | ◯ vòng rỗng |
| Hình học | △ tam giác | □ vuông |
| Vịt | con vịt | quả trứng |

**Màu KHÔNG thuộc về bộ quân.** Mọi bộ dùng đúng `--mark-one` và `--mark-two` đã có số
đo trong `MASTER.md` §1 và §2. Đổi bộ quân không đổi một hex nào, nên không phép đo
tương phản nào phải làm lại — và không có đường nào để một bộ quân mới lén đưa màu mới
vào sản phẩm (`MASTER.md` §9 cấm màu ngoài file đó).

**Điều kiện nhận một bộ:** hai hình phải phân biệt được khi ảnh bị **xám hoá** và khi ô
ở **28px**. Bộ nào không qua thì không vào — kể cả bộ Vịt, dù nó đúng thương hiệu.

Bộ quân sống trong `settingsStore` (ADR-0019), **không** trong `SavedGame`: nó thuần
trình bày, không đổi kết quả ván nào. Đây là chỗ nó khác hẳn `Rule` của ADR-0025 — mở
lại một ván cũ với bộ quân khác cho ra đúng cái ván đó, chỉ vẽ khác.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Bộ quân đổi cả màu (ví dụ "xanh vs cam") | Đưa hex mới vào sản phẩm qua cửa sau, và mời người dùng chọn một cặp không đạt 3:1. Phân biệt bằng màu cũng là đúng thứ ADR-0008 bác |
| Dùng emoji (🦆 / 🥚) cho bộ Vịt | Rẻ và đúng thương hiệu, nhưng `MASTER.md` §9 cấm emoji làm icon: không kiểm được tương phản, không kiểm được nét, và hình phụ thuộc phông chữ của từng máy |
| Mỗi ghế chọn hình riêng | Sinh ra tổ hợp mà không ai kiểm được — người chơi tự chọn hai hình giống nhau là mất khả năng đọc bàn, và không có cách nào chặn mà không thành một bảng luật |
| Lưu bộ quân trong `SavedGame` | Đóng băng cái không cần đóng băng. Ván cũ sẽ vẽ bằng bộ cũ dù người chơi đã đổi — trông như một lỗi |
| Chỉ hai bộ, bỏ Vịt và Hình học | An toàn nhất. Nhưng bộ Vịt là thứ duy nhất trong danh sách mang tên sản phẩm, và tiêu chí xám hoá + 28px đã đủ để chặn nếu nó không đạt |

## 4. Hệ quả

**Được:**

- ADR-0008 còn nguyên: bốn bộ đều phân biệt bằng hình, cả bốn xám hoá vẫn đọc được.
- Không phép đo tương phản nào phải làm lại.
- `render/layers/marks.ts` chuyển từ một `if (side === 'one')` sang một bảng tra hình —
  thêm bộ thứ năm về sau là thêm một dòng, không phải một nhánh.

**Mất / phải chấp nhận:**

- **Bộ Vịt là bộ mỏng manh nhất.** Ba nét (đầu, mỏ, thân) ở ô 28px là gần ngưỡng đọc
  được. Nó phải qua được lần nhìn tận mắt ở bước 5 của flow; không qua thì bỏ, và bỏ một
  bộ đã vẽ xong dễ hơn là giữ một bộ không đọc nổi.
- Bốn bộ × hai hình = tám path phải kiểm ở cả hai chế độ sáng/tối và ở cả mức phóng nhỏ
  nhất (16px) lẫn lớn nhất (64px).
- `settingsStore.parse` phải kiểm tên bộ lạ và rơi về mặc định, giống cách nó đang làm
  với `defaultLevel` — một bộ không tồn tại là một khoá tra bảng `undefined`, và canvas
  sẽ vẽ ra không gì cả.

**Điều kiện xem lại quyết định này:** nếu có người chơi mù màu hoàn toàn phản hồi rằng
một cặp cụ thể vẫn khó tách — lúc đó tiêu chí "xám hoá" chưa đủ và cần thêm một tiêu chí
về diện tích nét, không phải thêm màu.
