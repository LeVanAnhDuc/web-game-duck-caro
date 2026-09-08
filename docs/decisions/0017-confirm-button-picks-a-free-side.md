# ADR-0017 · Nút xác nhận đánh tự chọn cạnh trống, không neo cứng bên phải

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-02 · FR-10 · NFR-A11Y-03 · ADR-0007 · ADR-0009

## 1. Bối cảnh

`BoardStage` đặt nút "Đánh" ở `left + cell + 8` — tức 8px **vào trong ô kế bên**. Ô đó
có quân thì nút che mất quân. Từ mốc 1 tới mốc 4 chuyện này hiếm gặp: chuột không bao giờ
tạo quân xem trước (ADR-0007), nên chỉ người dùng cảm ứng mới thấy.

FR-10 làm quân xem trước xuất hiện trên **mọi** thiết bị, và tệ hơn: nó che đúng cái quân
mà gợi ý vừa bảo người chơi nhìn. Phát hiện lúc rà mockup mốc 5 — nút che ~20 trên 28px
của quân bên cạnh ở khổ 375.

## 2. Quyết định

Nút xác nhận chọn chỗ bằng một hàm thuần: thử bốn cạnh của ô theo thứ tự
**phải → trái → dưới → trên**, lấy cạnh đầu tiên vừa **không có quân** vừa **còn nằm
trong khung nhìn**. Không cạnh nào thoả thì về mặc định bên phải. Hàm nhận `moves`, ô
đang xem trước, camera và kích thước khung; trả một điểm màn hình.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Neo nút cố định ở đáy khung bàn | Không bao giờ che gì, nhưng mất liên hệ nhìn thấy giữa nút và ô sắp đánh — trên bàn vô hạn, "đánh ở đâu" là thông tin duy nhất mà nút cần mang. |
| Bỏ nút, chỉ hiện quân mờ và bắt tap lại đúng ô | Ít code nhất, nhưng phá bước xác nhận của ADR-0007 — vốn tồn tại vì ô nhỏ hơn ngón tay (NFR-A11Y-03). |
| Cho nút trong suốt một nửa khi chồng lên quân | Vẫn che, chỉ là che mờ. Và làm chữ trên nút rơi xuống dưới 4.5:1. |

## 4. Hệ quả

**Được:**
- Quân không bao giờ bị nút che, ở mọi mức phóng và mọi thế bàn.
- Hàm thuần nên test được bằng unit test, không cần DOM và không cần trình duyệt.

**Mất / phải chấp nhận:**
- Nút không còn ở một chỗ cố định so với ô, nên vị trí của nó thay đổi giữa hai lần
  xem trước liền nhau. Chấp nhận: che mất quân tệ hơn nút nhảy chỗ.
- Thêm một hàm nữa vào `render/` phải giữ đồng bộ với bất biến 11 (mọi phép đổi toạ độ
  đi qua `render/camera`).

**Điều kiện xem lại quyết định này:** nếu sau này bàn có một vùng HUD cố định — lúc đó
"cạnh trống" phải tính thêm cả HUD, không chỉ quân.
