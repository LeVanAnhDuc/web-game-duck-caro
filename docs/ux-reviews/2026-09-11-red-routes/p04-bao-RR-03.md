# Phiên p04 · Bảo — thua là phải biết vì sao · RR-03 Xem lại ván vừa đánh

- Viewport 1440×900 · mạng bình thường · storage dọn sạch qua CDP trước khi mở (xác nhận "nước 0")
- Công cụ: Playwright (hạng 1)

---

## 1. Ấn tượng 5 giây

Vừa vào trang, đập vào mắt là chữ "Duck Caro" và ngay dưới một câu mô tả thẳng: "Đánh caro với máy trên một bàn không có biên. Năm quân liền là thắng — trừ khi bị chặn cả hai đầu." Không có ảnh nền, không có video giới thiệu, không có nút đăng nhập/đăng ký nào cả — chỉ có bộ chọn Mức khó (Dễ/Thường/Khó), chọn Ai đi trước (Bạn/Máy), và một nút "Bắt đầu ván mới".

- Đây là trang gì, làm được gì cho mình: rõ ràng ngay — một bàn caro chơi với máy, không có gì mập mờ.
- Dành cho ai: có vẻ trung tính, không đặc biệt "dành cho gamer" hay "dành cho người mới" — không có gì báo hiệu độ khó AI thật sự ra sao ngoài ba cái tên chung chung.
- Có tin để nhập email/số điện thoại không: không cần, trang không hỏi gì cả nên khỏi phải lăn tăn khoản đó.
- Ba từ tả cảm giác: **gọn, trần trụi, không biết mình sắp đấu với con AI mạnh cỡ nào.**

## 2. Chuyện đã xảy ra

Chọn "Thường" (mặc định sẵn), "Bạn" đi trước (cũng mặc định sẵn), bấm "Bắt đầu ván mới". Bàn cờ hiện ra dạng canvas kéo-thả-zoom được, có cả gợi ý bàn phím ("mũi tên dịch con trỏ, Enter đánh") — cái này khá hay vì mình chơi bằng bàn phím chính xác hơn là mò chuột trên một bàn vô hạn.

Đánh vài nước đầu mình cố xây một hàng ngang, thì bị máy chặn ngay lập tức ở đầu hàng — phản xạ y như chơi với người thật, không phải kiểu AI "ngáo". Ván kéo dài 38 nước, mình vừa nối vừa bị chặn qua lại, và cuối cùng máy âm thầm dựng được một cột dọc 5 quân liền ở x=-1 (từ y=-2 đến y=2) mà không nước nào của mình chặn kịp — nói thật lúc nhìn lại danh sách nước đi mới ngã ngửa ra là máy đã rải quân ở cột đó từ tận nước thứ 2, rồi âm thầm lấp dần, còn mình mải đuổi theo mấy hàng ngang/dọc khác bị bít cả hai đầu. Đúng kiểu "thua mà không biết thua từ nước nào" — y như cái mình sợ.

Màn hình kết quả hiện ra: dòng "Máy thắng" và "nước 38" nằm gọn trong khung bên phải (sidebar), ngay dưới khung "Thành tích", **không phải một popup/modal che kín bàn cờ** — bàn cờ chính vẫn hiển thị nguyên, không bị lớp phủ nào đè lên. Ngay dưới dòng "Máy thắng" là hai nút nằm cạnh nhau: "Chơi lại" và "Xem lại". Không cần tìm kiếm gì cả — đúng cái mình cần lại nằm sẵn ngay đó, không phải lục menu hay cuộn xuống đâu xa.

*Bấm "Xem lại"*: xuất hiện chỉ báo "Đang xem lại — 38 / 38", danh sách 38 nước giờ mỗi nước là một nút bấm được, cộng thêm cụm nút điều hướng "Về nước đầu / Nước trước / Nước sau / Tới nước cuối" và "Thoát xem lại". Bấm thẳng vào nước thứ 19 trong danh sách — chỉ số nhảy đúng thành "19 / 38", nút "Nước sau" từ chỗ bị mờ (disabled) chuyển thành bấm được, "Nước trước" cũng bấm được — đúng là đang ở giữa ván, không phải đầu/cuối. Bấm "Thoát xem lại" thì quay lại y nguyên màn hình kết quả ban đầu ("Máy thắng" / "nước 38" / hai nút Chơi lại-Xem lại) — không bị văng ra chỗ khác, không mất trạng thái.

## 3. Con số

- Mức khó: Thường. Ai đi trước: Bạn.
- Kết quả: Máy thắng, kết thúc ở **nước 38**.
- Thành tích mục "Thường" cập nhật thành: **0 thắng · 1 thua · 0 bỏ**.
- Xem lại: nhảy thẳng tới nước **19/38**, giữa chừng, thoát ra sạch sẽ.
- Console: 0 lỗi. Khoảng 67 cảnh báo lặp — chủ yếu "AudioContext was not allowed to start"
  (lặp lại mỗi lần có nước đi) và một loạt cảnh báo font `.woff2` preload không dùng kịp.
- Network: không request lỗi (65 request tĩnh).

## 4. Ba từ sau khi dùng

**Gọn, đúng ý, hụt hẫng-nhẹ.** Có quay lại chơi tiếp không — có, vì cái mình cần (xem lại ván) có thật và dễ thấy, không phải đoán mò. Nhưng so với ấn tượng ban đầu ("không biết AI mạnh cỡ nào") thì giờ đổi thành hơi dè chừng: chơi thua mà không hề có cảnh báo/gợi ý kiểu "máy đang dựng 3 quân ở cột x=-1" lúc đang chơi — phải thua xong, vào Xem lại, tự lần từng nước mới hiểu ra chỗ hỏng. **Nút "Gợi ý" (Hint) có tồn tại nhưng bị khoá (disabled) suốt từ đầu tới cuối ván** — cái này thì hơi lạ, đáng ra mình sẽ thử bấm thử xem gợi ý là gì.

**Ghi chú giới hạn quan trọng (lời của agent, không phải nhân vật):** phiên này chỉ được phép thao tác trình duyệt, không được mở lại ảnh đã chụp để tự nhìn, nên phần "chuỗi 5 quân của máy có được tô sáng/đánh dấu rõ ràng trên bàn cờ lúc kết ván hay không" KHÔNG tự kiểm chứng được bằng mắt trong phiên này — chỉ biết chắc bảng kết quả không che bàn cờ. Cần người xem ảnh `p04-rr03-02-man-hinh-ket-qua-thua.png` để xác nhận.

## 5. Đính kèm thô

Ảnh (trong `shots/`):
- `p04-rr03-01-mo-trang-lan-dau.png` — màn hình mở trang lần đầu
- `p04-rr03-02-man-hinh-ket-qua-thua.png` — màn hình kết quả "Máy thắng", nước 38
- `p04-rr03-03-xem-lai-nuoc-giua.png` — đang xem lại ở nước 19/38
- `p04-rr03-04-man-hinh-cuoi-sau-thoat-xem-lai.png` — sau khi thoát xem lại

Console (nguyên trạng, rút gọn):
```
[WARNING] The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.
  @ .../_next/static/chunks/app/page-08cceff8166043e9.js:0
[WARNING] The resource .../_next/static/media/<hash>-s.p.woff2 was preloaded using link preload
  but not used within a few seconds from the window's load event.
  (lặp lại cho 9 file .woff2 khác nhau, nhiều đợt)
Total: 0 errors, 67 warnings
```
Network: "Note: 65 static requests not shown" — không request nào lỗi.

---

## Ghi chú của người điều phối (không phải lời persona)

- **Đạt `done_when` của RR-03.** Vào xem lại · nhảy tới nước 19/38 (giữa ván) · thoát ra về
  màn hình cũ. 3 bước / `min_steps` 3 — đúng đường đi tối ưu, không lạc bước nào.
- Phiên này cũng chơi TRỌN một ván (RR-01) và kết ván bằng thua. Màn kết quả nằm trong
  sidebar, KHÔNG phải lớp phủ → phần "không bị che" của RR-01 `done_when` coi như đạt.
  Phần "chuỗi năm quân được tô rõ" phải do `ux-expert` xác nhận bằng mắt trên ảnh
  `p04-rr03-02-man-hinh-ket-qua-thua.png`.
- **Mâu thuẫn cần đối chiếu:** Bảo báo nút "Gợi ý" bị khoá suốt ván trên desktop, trong khi
  p01 (Mai, điện thoại) BẤM ĐƯỢC "Gợi ý" và nhận được nước đề xuất. Hai quan sát trái nhau
  về cùng một nút.
