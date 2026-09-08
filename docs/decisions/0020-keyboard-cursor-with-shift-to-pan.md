# ADR-0020 · Mũi tên dịch con trỏ; Shift + mũi tên kéo bàn

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-15 · NFR-A11Y-02 · NFR-A11Y-06 · ADR-0002 · ADR-0009

## 1. Bối cảnh

`NFR-A11Y-02` đòi mọi hành động làm được bằng bàn phím, **kể cả đánh quân và di chuyển
bàn**. Tới hết mốc 5, ngưỡng này không đạt: bàn là canvas, và canvas không có gì để tab
tới. Bàn lại vô hạn (ADR-0002) nên không có danh sách ô hữu hạn để đi qua — phải có một
con trỏ.

Vấn đề thật: mũi tên phải làm **hai** việc khác nhau (dịch con trỏ, kéo bàn) mà chỉ có
một bộ bốn phím.

## 2. Quyết định

Mũi tên trần dịch **con trỏ** một ô. `Shift` + mũi tên **kéo bàn** một ô, con trỏ đứng
yên tại chỗ trên màn hình. `Enter`/`Space` đánh. `+`/`-` thu phóng. `Home` về giữa.
`h` gợi ý, `u` hoàn nước.

Con trỏ **kéo khung nhìn theo nó**: đi tới mép thì bàn tự dịch, qua một hàm thuần
`ensureVisible` trong `render/camera` (bất biến 11).

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Một **chế độ** riêng để kéo bàn (bấm `P` để vào/ra) | Người dùng không biết mình đang ở trong chế độ nào, và trên bàn vô hạn điều đó nghĩa là mỗi phím mũi tên làm một trong hai việc hoàn toàn khác nhau — không thể đoán, không thể sửa sai nhanh. Đây cũng là nhóm người dùng ít có khả năng thấy dấu hiệu chế độ nhất. |
| Mũi tên kéo bàn, con trỏ luôn ở giữa màn hình | Bỏ được sự nhập nhằng, nhưng biến việc chọn ô thành việc lái cả khung nhìn: muốn đánh cạnh quân vừa đánh cũng phải dịch cả bàn. Chậm và mỏi. |
| `Tab` đi qua các ô "đáng đánh" do AI đề xuất | Nghe tiện, nhưng nó biến bàn phím thành một cách chơi KHÁC — người dùng bàn phím chỉ đánh được vào ô mà AI nghĩ tới. Đó là một game khác, không phải cùng game. |
| `PageUp`/`PageDown` để kéo bàn | Không nhập nhằng, nhưng chỉ có hai chiều trong khi bàn có bốn. |

## 4. Hệ quả

**Được:**

- `NFR-A11Y-02` đạt được, và tiêu chí "chơi trọn một ván chỉ bằng bàn phím" của
  `overview.md` §6 trở nên đo được.
- Không có chế độ nào, nên không có trạng thái ẩn để người dùng mắc vào.

**Mất / phải chấp nhận:**

- `Shift` + mũi tên là quy ước phải học, và chỗ duy nhất dạy nó là màn cài đặt. Chấp
  nhận: người chơi bàn phím là người sẽ thử `Shift` trước tiên.
- Con trỏ là một mẩu trạng thái nữa trong `useBoardCanvas`, và nó phải bị dọn đúng lúc
  (ván mới, hoàn nước, vào xem lại) — cùng loại lỗi mà quân xem trước từng gây ra.

**Điều kiện xem lại quyết định này:** nếu thêm chế độ chơi có bàn hữu hạn (đang là
Non-Goal) thì danh sách ô trở nên hữu hạn, và `Tab` qua từng ô lại thành hợp lý.
