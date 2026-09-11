# ADR-0028 · Thanh hai ghế thay `StatusLine`, dùng chung cho cả hai chế độ

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** FR-17 · US-05 · NFR-A11Y-06 · ADR-0008 · ADR-0024

## 1. Bối cảnh

`StatusLine` của v1 là một dòng chữ cao 37px, cũng là vùng `aria-live` của `NFR-A11Y-06`.
Ở chế độ đấu máy nó đủ: chỉ có hai khả năng, mà một trong hai là "bạn", nên người chơi
gần như không cần đọc.

Hot-seat phá giả định đó. Hai người nhìn chung một màn hình, không ai là "bạn", và "tới
lượt ai" trở thành **thông tin chính của màn hình** chứ không phải một dòng phụ. Bản
mockup đầu tiên giữ nguyên `StatusLine` và bị bác ở buổi duyệt với đúng lý do đó:
*"phần 2 người thì nên có UI để biết đến lượt của user nào"*.

## 2. Quyết định

Một component **thanh hai ghế** cao 56px, thay hẳn `StatusLine`, phục vụ **cả hai chế độ**.

Màn hình chia đôi, mỗi nửa là một ghế: hình quân của ghế đó + tên ghế. Ghế đang tới lượt
mang nền `--paper`, chữ `--ink-strong` đậm và **gạch chân 3px màu quân của chính ghế đó**;
ghế còn lại để chữ `--ink-muted` và hình mờ 40%. Số nước nằm trên vạch chia giữa hai nửa.

Tên ghế lấy từ `Mode` (ADR-0024): hot-seat là "Người 1 / Người 2", đấu máy là "Bạn / Máy",
và khi engine đang nghĩ thì nửa phải đổi thành "Máy đang nghĩ…". Ván đã kết thúc thì
**không** có thanh này — không còn lượt của ai cả.

**Tín hiệu thứ hai, ở đúng chỗ mắt đang nhìn:** quân xem trước tại con trỏ mang **hình
của bên đang đi** (`--preview-opacity` .45). Cơ chế xem trước đã có sẵn từ ADR-0007, nên
đây là tín hiệu miễn phí — và nó nằm trên bàn, không nằm trên thanh trạng thái.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ `StatusLine`, chỉ đổi chữ thành "Lượt Người 2" | Bản đã bị bác. Thông tin chính của màn hình mang cùng trọng lượng với một dòng phụ, và không thấy được ghế kia là hình gì |
| Tô nền cả màn theo màu bên đang đi | Đọc rất rõ, nhưng nền bàn là `--paper` có số đo tương phản với quân. Đổi nền là làm hỏng mọi phép đo của `MASTER.md` §1 và §3 |
| Xoay 180° nửa của Người 2 cho người ngồi đối diện | Đúng cho cảnh đặt máy giữa bàn. Bác vì quân trên bàn không xoay được, nên một nhãn xoay sẽ chỏi với chính thế trận nó đang mô tả |
| Chỉ dựa vào quân xem trước, bỏ hẳn thanh | Quân xem trước chỉ hiện khi có con trỏ. Trên cảm ứng, trước lần chạm đầu tiên thì không có tín hiệu nào |
| Đồng hồ đếm giờ cho mỗi ghế | Là thứ hot-seat hay có, nhưng không ai yêu cầu, và nó kéo theo trạng thái chạy theo thời gian trong `useGame` |

## 4. Hệ quả

**Được:**

- Một component cho hai chế độ, nên không có hai chỗ để lệch nhau.
- "Tới lượt ai" mang bằng **vị trí và độ đậm** trước, màu chỉ là lớp dư — cùng nguyên
  tắc ADR-0008 áp cho quân. Xám hoá ảnh vẫn đọc được ai đang đi.
- Vùng `aria-live` của `NFR-A11Y-06` chuyển vào component này, vẫn đúng một chỗ.

**Mất / phải chấp nhận:**

- **Mất 19px chiều cao bàn** (56 thay cho 37) ở mọi khổ. Trên 375 đó là hơn nửa một ô.
- Chế độ đấu máy cũng đổi giao diện dù không ai xin — người đang chơi v1 sẽ thấy khác.
  Chấp nhận vì phương án ngược lại là hai component song song cho cùng một việc.
- Ván kết thúc thì thanh biến mất, tức bố cục dịch 56px đúng lúc sheet kết ván mở. Phải
  kiểm tận mắt rằng nó không giật (`NFR-A11Y-05` — `prefers-reduced-motion`).

**Điều kiện xem lại quyết định này:** nếu có chế độ nhiều hơn hai ghế, hoặc nếu đo được
rằng người chơi trên 375 thật sự thiếu chiều cao bàn — lúc đó thanh phải gộp vào header
thay vì đứng riêng.
