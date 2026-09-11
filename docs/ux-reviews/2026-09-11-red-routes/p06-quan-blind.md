# Phiên mù p06 · Quân — kỳ thủ thi đấu (NEGATIVE PERSONA)

- Viewport 1440×900 · mạng bình thường · storage dọn sạch qua CDP
- Công cụ: Playwright (hạng 1)
- **Không giao mục tiêu.** Persona tự quyết định làm gì và dừng lúc nào.
- Đây là phép thử ngược: nếu Quân thấy dễ chịu và ở lại thì đó là CẢNH BÁO — sản phẩm đang
  trôi ra khỏi Non-Goals của chính nó (`overview.md` §4).

---

**1. Ấn tượng 5 giây**
Vừa vào là thấy chữ "Duck Caro" to giữa màn hình, dưới có một câu mô tả luật ("đánh caro với máy trên một bàn không có biên, năm quân liền là thắng — trừ khi bị chặn cả hai đầu"), rồi hai cụm nút: mức khó (Dễ/Thường/Khó) và ai đi trước (Bạn/Máy).
- Đây là trang gì? — Một ván caro chơi với máy, một-người-một-máy, không hơn.
- Dành cho ai? — Nhìn cách trình bày thì đây là đồ chơi giải trí nhẹ nhàng, **không phải sân cho dân thi đấu**.
- Có tin để nhập gì vào không? — Không có ô nào để nhập cả, nên câu này không áp dụng.
- Ba từ: **"đơn giản — chưa rõ luật — thiếu đối thủ."**

**2. Chuyện đã xảy ra**
Tôi thấy câu mô tả luật ngay đầu trang, nhưng nó không giống luật renju tôi quen: không có chữ nào về cấm 3-3, cấm 4-4 hay cấm nước dài quá 5 cho quân đi trước — tức là bàn này chơi tự do (freestyle), không phải renju thi đấu. Câu "năm quân liền là thắng — trừ khi bị chặn cả hai đầu" cũng làm tôi khựng lại một chút — trong luật tôi biết, năm quân liền là thắng bất kể có bị chặn hay không, chặn hai đầu chỉ ngăn được *bốn* quân mở chứ không huỷ được một hàng *năm* đã đủ. Nghĩ trong đầu: **"luật này viết ngược với cái tôi biết, hay đây là luật riêng của họ?"**

Việc tiếp theo tôi làm là bấm nút "Cài đặt" — hi vọng tìm thấy trang luật chi tiết hơn hoặc một mục nào đó về chơi mạng/PvP. Hộp thoại hiện ra chỉ có: bật/tắt âm thanh, mức khó mặc định, chú thích phím tắt, và nút xoá dữ liệu. Không có gì về luật, không có gì về người chơi khác. Đóng lại, nhìn xuống khung bên phải thấy mục "Thành tích" chỉ liệt kê ba dòng Dễ/Thường/Khó — toàn bộ đều "chưa chơi", không có bảng xếp hạng, không có ô nào ghi "chơi với người". Trong đầu: **"vậy là chỉ có một mình mình với máy thôi à."**

Đến đây tôi tự nói: "thôi kệ, đánh thử vài nước xem máy mạnh cỡ nào trước khi bỏ đi." Chuyển sang mức Khó, bắt đầu ván mới, đi quân đầu ở giữa bàn (0,0). Máy đáp trả gần như ngay lập tức, đi chéo sát bên (-1,-1) — một nước bám khá chuẩn. Tôi đi tiếp một quân dựng đôi thẳng hàng (0,-1), tính bụng dò xem máy có chặn kịp không — máy chặn ngay lập tức ở đầu kia của hàng đôi đó (0,1). Phản ứng nhanh, đúng chỗ, không có gì để chê về mặt chiến thuật cơ bản — nhưng đây cũng chỉ là hai nước, chưa đủ để nói lên "chiều sâu" thật sự.

Tới lúc này tôi coi như đã có đủ thông tin: không có chế độ đấu người thật, không có bảng xếp hạng, luật ghi ra khác với luật renju thi đấu tôi quen — nên tôi bấm "Bỏ ván" và dừng lại.

**3. Con số**
- Số bước bấm/gõ phím trước khi quyết định rời đi: khoảng **9 hành động**.
- Số lần bế tắc liên tiếp trước khi bỏ cuộc: đúng 2 — (1) không tìm thấy luật renju/chi tiết luật ở đâu ngoài một dòng mô tả mơ hồ; (2) không tìm thấy chế độ chơi với người/bảng xếp hạng ở cả màn hình chính lẫn trong Cài đặt.
- Thời gian máy phản hồi mỗi nước: gần như tức thời.

**4. Ba từ sau khi dùng**
**"Gọn — cô đơn — chưa đủ đô."** So với ấn tượng ban đầu ("đơn giản — chưa rõ luật — thiếu đối thủ"), cảm giác chỉ càng chắc chắn hơn theo hướng tiêu cực chứ không đổi chiều. **Không quay lại** — không phải vì máy yếu (máy chặn khá nhạy), mà vì không có đối thủ người thật và luật thi đấu rõ ràng.

**5. Đính kèm thô**
Ảnh (trong `shots/`):
- `p06-blind-01-mo-trang-lan-dau.png` — màn hình lúc vừa mở, chưa bấm gì
- `p06-blind-02-bat-dau-van-kho.png` — sau khi chọn mức Khó, bắt đầu ván mới
- `p06-blind-03-sau-nuoc-dau.png` — sau nước đi đầu tiên và phản hồi của máy
- `p06-blind-04-quyet-dinh-bo-di.png` — khoảnh khắc quyết định bỏ đi
- `p06-blind-05-man-hinh-cuoi.png` — màn hình cuối, sau khi bấm "Bỏ ván"

Console: 0 lỗi, 18 cảnh báo — AudioContext chưa được phép chạy tự động; vài file font `.woff2`
preload không dùng kịp. Không có lỗi JS.
Network: chỉ request tĩnh, không có request tới máy chủ ứng dụng.

---

## Ghi chú của người điều phối (không phải lời persona)

- **Kết quả ĐÚNG như thiết kế.** Quân bỏ đi ở hành động thứ 9, sau đúng 2 bước bế tắc, và
  nói rõ vì thấy gì: không có PvP, không có bảng xếp hạng, luật không phải renju. Đây là
  **thành công** của việc giữ Non-Goals, không phải thất bại.
- **Nhưng có một phát hiện thật nằm trong đó:** câu luật ở màn hình đầu —
  "Năm quân liền là thắng — trừ khi bị chặn cả hai đầu" — khiến một người **biết chơi** phải
  khựng lại và tự hỏi "luật này viết ngược với cái tôi biết". Đây là luật caro Việt (chặn hai
  đầu thì hàng 5 không tính), nhưng câu chữ không nói rõ đây là biến thể Việt, nên người quen
  luật quốc tế đọc xong càng mơ hồ hơn chứ không rõ hơn.
