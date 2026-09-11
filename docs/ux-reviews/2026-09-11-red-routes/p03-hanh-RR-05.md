# Phiên p03 · Hạnh — chỉ dùng bàn phím · RR-05 Đánh một ván chỉ bằng bàn phím

- Viewport 1440×900 · mạng bình thường
- Công cụ: Playwright (hạng 1). **Không nạp** `browser_click`/`browser_hover`/`browser_drag` —
  rào cứng để phiên này không thể chạm chuột kể cả khi bí.
- **LỖI CỦA LƯỢT CHẠY, ẢNH HƯỞNG TRỰC TIẾP TỚI PHIÊN NÀY:** lệnh xoá `localStorage` bị app
  ghi đè lại trước khi tải lại trang, nên Hạnh mở trang và thấy **bàn cờ đang dở của phiên p02**
  chứ không phải màn hình thiết lập của người mới. Phần "Ấn tượng 5 giây" của phiên này vì vậy
  KHÔNG so sánh được với các persona khác — cô đang tả một ván đang dở, không phải trang chủ.
  Phần đánh giá bàn phím (phần lõi của RR-05) không bị ảnh hưởng.

---

**1. Ấn tượng 5 giây**

Mở link ra là thấy ngay một bàn cờ ca-rô đã có sẵn chục nước đi (X và O rải rác giữa bàn), một khung "Lượt bạn" bên phải, danh sách nước đi, ba nút "Dễ / Thường / Khó", và mấy nút to: Hoàn, Gợi ý, Giữa, Bỏ ván. Góc trên phải có nút loa và bánh răng cài đặt.

- Đây là trang gì: một ván cờ ca-rô đang chơi dở, chắc là chơi với máy.
- Dành cho ai: có vẻ dành cho người biết chơi ca-rô rồi, không có hướng dẫn nhập môn nào hiện ra.
- Có tin để nhập email/số điện thoại không: không có chỗ nào đòi cái đó cả, nên không phải lo khoản này.
- Ba từ lúc này: bối rối, hoài nghi, tò mò (sao bàn đã có quân sẵn mà mình chưa bấm gì?).

**2. Chuyện đã xảy ra**

Việc đầu tiên tôi làm là bấm Tab để xem trang có "nghe" bàn phím không. Vòng sáng đầu tiên rơi vào nút "Hoàn" ở khu bên phải — có viền xanh rõ ràng, thấy ngay mình đang ở đâu. Tab tiếp lần lượt qua "Gợi ý", "Giữa", "Bỏ ván" — mỗi lần đều thấy viền sáng đàng hoàng. Tới đây tôi nghĩ: "được đấy, ít nhất mấy cái nút này ổn."

Rồi đến cú Tab thứ năm — mọi thứ biến mất. Không có viền sáng ở đâu cả, màn hình y như không có gì đang được chọn. Đúng cái khoảnh khắc mà tôi vẫn sợ nhất: mất dấu giữa chừng, không biết phím mũi tên hay Enter tiếp theo sẽ rơi vào đâu. Bình thường đây là lúc tôi đóng tab luôn, không thử lại — nhưng vì hôm nay cố tình kiên nhẫn hơn một chút để xem có tự hồi lại không, tôi bấm thêm một Tab nữa theo phản xạ. May sao lần đó viền sáng quay lại, rơi vào nút loa "Tắt âm thanh" ở góc trên phải, rồi đến bánh răng "Cài đặt".

Bấm Tab thêm một lần nữa thì tới bàn cờ — và bất ngờ là bàn cờ có nói cho tôi biết cách chơi: "Bàn caro. Mũi tên dịch con trỏ, Enter đánh, Shift và mũi tên kéo bàn, Home về giữa." Đây là lần đầu tiên một trang tự giải thích phím tắt mà không cần tôi đoán mò. Tôi thử ngay: bấm mũi tên phải, có một ô hiện viền xanh nhích sang, và một dòng chữ nhỏ phía dưới báo "Con trỏ ở 2, 1. Ô trống." — biết chính xác mình đang đứng ở ô nào, ô đó trống hay có quân của ai. Bấm Enter — quân X của tôi xuất hiện, ngay sau đó máy đánh trả lời, có dòng chữ báo "Máy đánh ở 3, -2. Lượt bạn." Tôi lặp lại thêm hai lần nữa (dò ô trống bằng mũi tên, đọc dòng trạng thái, bấm Enter) — tổng cộng đặt được 3 quân, không chạm chuột lần nào.

Sau đó tôi thử giữ Shift rồi bấm mũi tên phải để kéo bàn — cả bàn cờ trượt sang, con trỏ vẫn đứng yên tại chỗ trên màn hình nhưng giờ trỏ vào một ô khác của bàn (đúng như kiểu "kéo tấm giấy bên dưới ngón tay"). Bấm Home thì bàn tự phóng to và canh lại cho cụm quân cờ về giữa màn hình. Cả hai thao tác này đều làm được bằng bàn phím.

**3. Con số**
- Số lần bấm Tab tới khi chạm được bàn cờ: 8 lần (4 nút sự vụ bên phải → khoảng trống mất dấu → loa → cài đặt → bàn cờ).
- Số lần "mất dấu" focus hoàn toàn (không thấy viền sáng ở đâu): 1 lần, ngay sau nút "Bỏ ván".
- Số quân đặt được bằng bàn phím: 3/3 (mục tiêu đề ra).
- Số lần dịch/canh khung nhìn bằng phím thành công: 2/2 (Shift+mũi tên kéo bàn, Home về giữa).
- Tổng thao tác trình duyệt dùng: khoảng 25, không thao tác nào cần chuột.
- Console: 0 lỗi, chỉ có cảnh báo không ảnh hưởng (AudioContext chờ tương tác người dùng, vài font preload không dùng tới).
- Network: 0 request bất thường, chỉ 22 request tài nguyên tĩnh, đều tải xong.

**4. Ba từ sau khi dùng**

Nhẹ nhõm, bất ngờ, vẫn còn hơi rén.

So với ấn tượng đầu (bối rối/hoài nghi/tò mò), tôi đổi hướng khá nhiều — từ chỗ nghĩ "chắc lại một trang bỏ quên người dùng bàn phím" sang "ơ, cái bàn cờ này thực sự nói chuyện được với bàn phím, còn tự đọc trạng thái ô cho mình nữa". Tôi có quay lại chơi tiếp không? Có, vì phần lõi — đặt quân, dịch bàn — chạy mượt và có phản hồi bằng chữ rất rõ ràng, không phải đoán mò. Nhưng cái khoảnh khắc mất dấu hoàn toàn sau "Bỏ ván" vẫn làm tôi chột dạ — nếu hôm đó tôi không cố kiên nhẫn bấm thêm một Tab nữa (đúng cái tôi tự nhận là mình không làm), tôi đã đóng tab và kết luận "trang này bỏ rơi mình" ngay tại chỗ, trước khi kịp biết bàn cờ chơi được. Đây là một lỗ hổng thật, không phải chuyện nhỏ với người chỉ dùng bàn phím.

**5. Đính kèm thô**

Ảnh chụp (thư mục `shots/`):
- `p03-rr05-00-mo-trang.png` — màn hình lúc vừa mở, chưa bấm gì
- `p03-rr05-01-tab-1-hoan.png` — Tab lần 1, viền sáng ở nút Hoàn
- `p03-rr05-02-tab-5-mat-dau-focus.png` — Tab lần 5, mất dấu hoàn toàn
- `p03-rr05-03-tab-8-canvas-focus.png` — Tab lần 8, focus vào bàn cờ, viền xanh quanh cả bàn
- `p03-rr05-04-arrow-right-1.png`, `p03-rr05-05-arrow-right-2.png` — dò ô bằng mũi tên phải
- `p03-rr05-06-enter-danh-quan-1.png`, `07-enter-danh-quan-2.png`, `08-enter-danh-quan-3.png` — ba lần đặt quân bằng Enter
- `p03-rr05-09-shift-arrow-pan.png` — kéo bàn bằng Shift+mũi tên
- `p03-rr05-10-home-ve-giua.png` — Home đưa bàn về giữa
- `p03-rr05-11-man-hinh-cuoi.png` — màn hình cuối phiên

Chi tiết kỹ thuật thô của cú mất-dấu-focus (không phải lời của nhân vật):
```
Tab #4 (Bỏ ván): {tagName: BUTTON, nhan: "Bỏ ván", vienFocus: "solid 2px rgb(29,78,216)"}
Tab #5:          {tagName: BODY,   vienFocus: "none 2.66667px rgb(42,42,40)", nhinThayTrenManHinh: true}
Tab #6: {tagName: BUTTON, nhan: "Tắt âm thanh", vienFocus: "solid 2px rgb(29,78,216)"}
```
Console: 0 errors / 19 warnings (AudioContext autoplay, font preload not used) — không có lỗi JS.
Network: 22 static requests, không có request lỗi hay bất thường.

---

## Ghi chú của người điều phối (không phải lời persona)

- **Đạt `done_when` của RR-05.** Đặt 3 quân + dịch khung nhìn, không chạm chuột lần nào.
- Số bước thực tế: ~25 hành động / `min_steps` 6. Phần lớn chi phí nằm ở 8 lần Tab để tới
  được bàn cờ.
- Cú mất dấu focus ở Tab #5 vượt đúng `patience_threshold` = 2 của persona này. Cô chỉ đi
  tiếp được vì brief bảo cô cố thêm — trong đời thật cô đã đóng tab tại đó.
