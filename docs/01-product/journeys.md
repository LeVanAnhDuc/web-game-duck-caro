# Luồng người dùng

> **Trả lời:** Người dùng đi qua những luồng nào từ đầu đến cuối?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-11 · commit —
> **Cập nhật khi:** có luồng người dùng mới · một luồng cũ đổi bản chất

<!-- CÁCH ĐIỀN
Viết bằng NGÔN NGỮ NGƯỜI DÙNG. Không có tên bảng, tên endpoint, tên component ở đây.
Mỗi luồng một mục, ID tăng dần US-01, US-02... không tái dùng số.

Mục "Điều gì có thể sai" là mục có giá trị nhất — nó là nguồn của test case và của
các trạng thái lỗi trên UI. Bỏ trống mục đó thì AI sẽ chỉ hiện thực đường đi đẹp.

KHÔNG chứa: chi tiết bố cục UI, danh mục chức năng (-> 02-requirements/scope.md).
-->

## US-01 · Chơi trọn một ván với máy

**Bối cảnh:** Người chơi mở link lần đầu, trên điện thoại, không đọc hướng dẫn gì.

**Các bước:**

1. Chọn mức khó và chọn mình đi trước hay máy đi trước.
2. Đánh quân đầu tiên. Bàn trống nên nước đầu đặt ở giữa khung nhìn.
3. Máy đáp lại. Nếu nước của máy nằm ngoài chỗ đang xem, bàn tự trượt tới cho thấy.
4. Kéo bàn và thu phóng khi thế trận lan ra ngoài khung nhìn; bấm về giữa để thấy lại
   toàn bộ quân đã đánh.
5. Đánh tiếp tới khi một bên đủ năm quân không bị chặn hai đầu.

**Kết quả mong đợi:** Người chơi thấy chuỗi thắng được tô rõ và **không bị che**, thấy
kết quả kèm mức khó và số nước, và có ba đường đi tiếp: chơi lại, xem lại ván, đổi mức.
Kết quả được cộng vào thống kê của đúng mức khó vừa chơi.

**Điều gì có thể sai:**

- Kéo bàn bị hiểu thành đánh quân, hoặc ngược lại — ngón tay luôn di một chút khi tap.
- Tap trượt sang ô bên cạnh. Ở caro, một nước nhầm là mất ván.
- Đánh vào ô đã có quân.
- Người chơi đánh nước tiếp theo trước khi máy kịp trả lời nước trước.
- Máy nghĩ quá lâu, hoặc luồng tính toán chết hẳn — không được để trạng thái "máy đang
  nghĩ" kéo vô hạn.
- Ván kết thúc mà chuỗi thắng đang nằm ngoài khung nhìn.
- Người chơi đổi tab giữa lúc máy đang nghĩ rồi quay lại.
- Trình duyệt chặn âm thanh — phải im lặng, không được vỡ.
- Người chơi thu phóng ra rất xa rồi đánh: ô nhỏ hơn ngón tay nhiều lần.

**Chức năng liên quan:** FR-01 · FR-02 · FR-03 · FR-04 · FR-05 · FR-06 · FR-12 · FR-14

---

## US-02 · Mở lại tab và tiếp tục ván đang dở

**Bối cảnh:** Người chơi đang giữa một ván thì đóng tab, tắt máy, hoặc trình duyệt tự
huỷ tab để lấy bộ nhớ. Hôm sau mở lại link.

**Các bước:**

1. Mở lại link.
2. Ván dở hiện ra đúng như lúc rời đi: đủ quân, đúng lượt, đúng mức khó.
3. Đánh tiếp, hoặc bỏ ván để bắt đầu ván mới.

**Kết quả mong đợi:** Không phải chọn lại mức khó, không phải đánh lại từ đầu. Nếu lúc
rời đi đang là lượt của máy, máy nghĩ và đánh ngay khi vào.

**Điều gì có thể sai:**

- Trình duyệt chặn lưu trữ (cửa sổ ẩn danh, thiết lập chặn site data) — không có ván nào
  để tiếp, và điều đó phải im lặng, không phải một thông báo lỗi.
- Dữ liệu lưu từ một phiên bản cũ, hoặc bị hỏng — phải bỏ và vào ván mới, không được vỡ.
- **Hai tab mở cùng lúc**, cả hai cùng ghi ván đang chơi — tab này ghi đè ván của tab kia.
- Người chơi rời đi đúng lúc máy đang nghĩ: nước đó đã tính hay chưa?
- Lưu trữ đầy.

**Chức năng liên quan:** FR-11 · FR-06 · FR-05

---

## US-03 · Xem lại ván vừa đánh

**Bối cảnh:** Vừa thua một ván sát sao và muốn biết mình sai từ nước nào.

**Các bước:**

1. Từ màn kết ván, chọn xem lại.
2. Đi tới, đi lui từng nước, hoặc nhảy thẳng tới một nước trong danh sách.
3. Thoát xem lại để chơi ván mới.

**Kết quả mong đợi:** Bàn hiện đúng thế trận tại nước đang xem. Xem lại là **chỉ đọc** —
không đánh tiếp từ giữa ván được, vì cho phép đánh tiếp là tạo ra nhánh, và một ván có
nhiều nhánh thì thống kê không còn nghĩa gì.

**Điều gì có thể sai:**

- Xem lại một ván đang dở thay vì ván đã kết thúc.
- Nhảy tới một nước rồi bấm hoàn nước — hai chức năng cùng đi trên một danh sách nước đi.
- Ván rất dài, danh sách nước đi dài hơn màn hình.
- Thoát xem lại rồi mà bàn vẫn đứng ở thế trận giữa ván.

**Chức năng liên quan:** FR-08 · FR-09 · FR-07

---

## US-04 · Đổi mức khó và xem mình đang thắng thua thế nào

**Bối cảnh:** Đã thắng mức Thường vài ván và muốn thử mức Khó.

**Các bước:**

1. Mở thống kê, xem thắng / thua / bỏ ván của từng mức.
2. Đổi mức khó.
3. Chơi ván mới ở mức mới.

**Kết quả mong đợi:** Thống kê tách riêng theo từng mức, nên vài ván ở mức Dễ không làm
đẹp thành tích ở mức Khó. Đổi mức **giữa ván** thì phải hỏi xác nhận và ván đang chơi
tính là **bỏ ván** — vì mỗi kết quả phải thuộc về đúng một mức, không thể thuộc về hai.

**Điều gì có thể sai:**

- Đổi mức giữa ván mà không hỏi gì, làm mất ván đang chơi.
- Thống kê bị chặn lưu trữ nên luôn hiện toàn số 0.
- Bỏ ván không được đếm, khiến tổng số ván không khớp tổng thắng + thua.

**Chức năng liên quan:** FR-05 · FR-12 · FR-13 · FR-16

---

## US-05 · Chơi hai người trên cùng một máy

**Bối cảnh:** Hai người ngồi cạnh nhau, một cái điện thoại hoặc một cái laptop, chuyền
tay nhau đánh. Không ai muốn tạo tài khoản, không ai muốn đợi ghép cặp.

**Các bước:**

1. Ở màn bắt đầu, chọn chế độ **Hai người**. Mục mức khó biến mất — không có máy nào để
   đặt mức.
2. Chọn luật thắng: caro Việt (chặn hai đầu thì không tính) hoặc tự do (chặn vẫn thắng).
   Dòng giải thích bên dưới đổi theo lựa chọn, vì tên luật một mình không nói được luật.
3. Chọn ai đi trước: Người 1 hay Người 2.
4. Đánh luân phiên. Sau mỗi nước, chỉ dấu lượt đổi sang ghế kia, và quân xem trước ở con
   trỏ đổi sang hình của ghế đó.
5. Hoàn nước khi đánh nhầm — lùi **một** nước, tức trả lại đúng nước vừa đánh.
6. Đánh tới khi một bên đủ năm quân theo luật đã chọn.

**Kết quả mong đợi:** Ở bất kỳ thời điểm nào, cả hai người **nhìn một lần là biết đang
tới lượt ai** — không phải đếm quân trên bàn, không phải nhớ ai vừa đánh. Kết thúc thì
màn kết ván gọi đúng tên ghế thắng ("Người 1 thắng"), không gọi "Bạn thắng".

**Điều gì có thể sai:**

- Chỉ dấu lượt quá nhẹ nên cả hai cùng tưởng tới lượt mình, hoặc cùng tưởng không phải —
  đây là lỗi đặc trưng và duy nhất của chế độ này, và là lý do ADR-0028 tồn tại.
- **Hoàn nước lùi hai nước** theo quán tính của chế độ đấu máy, làm mất luôn nước của
  người kia.
- Người chơi đổi chế độ **giữa ván** — phải hỏi xác nhận, giống cách đổi mức khó ở US-04.
- Gợi ý được bấm ở chế độ hai người: nó dùng engine mức Khó (ADR-0016), nên người bấm
  được lợi thế mà người kia không biết là có.
- Ván hot-seat bị ghi vào thống kê của một mức khó nào đó — không mức nào đúng, vì không
  có máy nào tham gia.
- Mở lại tab: ván hot-seat đang dở phải tiếp tục ở đúng chế độ, đúng luật, đúng lượt —
  và **không** được gọi engine cho ghế thứ hai.
- Điện thoại đặt giữa bàn nên Người 2 ngồi đối diện đọc chữ ngược. Đã cân nhắc và **không**
  xoay nhãn (ADR-0028) — cảnh dùng được thiết kế cho là chuyền tay, không phải đặt giữa.

**Chức năng liên quan:** FR-17 · FR-18 · FR-02 · FR-03 · FR-07 · FR-11 · FR-13

---

## US-06 · Chỉnh giao diện cho hợp mắt

**Bối cảnh:** Người chơi buổi tối, đèn đã tắt, màn hình sáng quá. Hoặc: máy để chế độ
sáng nhưng muốn xem bản tối. Hoặc chỉ là muốn quân cờ trông khác đi.

**Các bước:**

1. Mở cài đặt.
2. Chọn giao diện: Sáng, Tối, hoặc Theo máy.
3. Chọn bộ quân trong bốn bộ — mỗi ô xem trước vẽ đúng hai hình của bộ đó, không phải
   một cái tên.
4. Đóng cài đặt. Bàn đã đổi, ván đang chơi không bị ảnh hưởng.

**Kết quả mong đợi:** Lựa chọn sống qua lần tải lại. Mở lại trang thì **không có cú nháy
màu nào** — trang hiện ra đã đúng chế độ đã chọn. Đổi bộ quân không đổi kết quả ván nào,
kể cả ván đang lưu.

**Điều gì có thể sai:**

- **Nháy sáng khi tải** với người chọn chế độ tối. Đây là lỗi dễ xảy ra nhất và khó thấy
  nhất trên máy dev nhanh — ADR-0026 tồn tại vì nó.
- Canvas không vẽ lại sau khi đổi theme: bảng màu của DOM đã đổi, quân trên bàn thì chưa.
- Chọn "Theo máy" rồi người dùng đổi thiết lập của hệ điều hành trong lúc trang đang mở.
- Trình duyệt chặn lưu trữ — lựa chọn không lưu được, và điều đó phải im lặng, mỗi lần
  mở lại về mặc định.
- Dữ liệu cài đặt hỏng, hoặc tên bộ quân không tồn tại (bản cũ, hoặc sửa tay trong
  DevTools) — phải rơi về mặc định, không được vẽ ra ô trống.
- Bộ quân mới không đọc được ở ô nhỏ nhất, hoặc hai hình của một bộ nhìn giống nhau khi
  ảnh bị xám hoá.

**Chức năng liên quan:** FR-19 · FR-20 · FR-16
