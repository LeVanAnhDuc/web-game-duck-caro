# Phiên p01 · Mai — chơi lúc đợi xe · RR-01 Đánh trọn một ván với máy

- Viewport 375×720 · throttle Slow 4G (latency 400ms, 400kbps) · localStorage đã xoá sạch
- Công cụ: Playwright (hạng 1)
- **Lưu ý về ảnh:** phiên này chạy trước khi người điều phối biết phải truyền `filename` cho
  `browser_take_screenshot`, nên 8 tấm ảnh của nó bị ghi vào **gốc repo** thay vì thư mục run.
  Chúng đã được tìm lại và chuyển vào `shots/` đầy đủ. Trong một quãng của lượt chạy, chúng bị
  tưởng nhầm là đã mất — xem `run-notes.md`.

---

**1. Ấn tượng 5 giây**
- Đây là trang gì? Nó làm được gì cho tôi? → Chơi cờ ca-rô với máy, thấy nút "Bắt đầu ván mới" to ngay giữa nên chắc bấm là chơi được liền, khỏi đăng ký.
- Trang này dành cho người như tôi hay dành cho ai khác? → Nhìn đơn giản, chắc ai cũng chơi được, không có vẻ dành riêng cho dân mê cờ.
- Tôi có tin nó đủ để nhập email/số điện thoại vào không? Vì sao? → Không thấy chỗ nào đòi nhập gì nên khỏi phải lo cái đó.
- Ba từ tả cảm giác lúc này: gọn gàng, hơi trống, tò mò.

**2. Chuyện đã xảy ra**
Mở link ra thấy chữ "Duck Caro" góc trên, dưới đó là một khung ghi luật chơi ngắn, chọn mức khó (Dễ/Thường/Khó — đang để sẵn "Thường"), chọn ai đi trước (Bạn/Máy — đang để sẵn "Bạn"), và một nút to "Bắt đầu ván mới". Tôi bấm luôn nút đó, không đọc luật.

Bấm xong khung luật biến mất, hiện bàn cờ trống trơn, có dòng chữ nhỏ "Kéo để di chuyển bàn · lăn chuột để thu phóng" — tôi lướt qua không để ý tới. Chạm ngón tay vào giữa bàn để đánh quân đầu (tay tôi hay lệch một chút khi chạm) — dòng "Máy đánh ở -1, 1. Lượt bạn." hiện ra ngay, máy trả lời liền, thấy ổn. Đánh thêm một nước nữa cũng bình thường.

Tới lần chạm thứ ba tôi lỡ tay xê dịch mạnh hơn một chút (giống lúc đứng ngoài đường, tay không vững). Lần này không có gì xảy ra — dòng trạng thái đứng yên y như nước trước, không thấy quân mới. Trong đầu tôi nghĩ: "ủa sao không thấy gì vậy ta, chắc mình bấm hụt". Hoá ra cái kéo tay đó bị hiểu thành "kéo bàn cờ" chứ không phải đánh quân — đúng như dòng chữ nhỏ đã ghi nhưng tôi có đọc đâu. Chạm lại nhẹ hơn thì ăn liền.

Thấy nút "Gợi ý" ở thanh dưới, tò mò bấm thử — nó hiện "Gợi ý: đánh ở 2, 1" kèm một nút "Đánh" riêng để xác nhận, tôi bấm cho lẹ không cần tự nghĩ nước đi, máy nhận liền. Đánh thêm hai nước nữa theo kiểu chạm đại vào chỗ trống gần đó, ván vẫn tiếp tục, chưa ai thắng. Tới đây coi như xe buýt sắp tới, tôi dừng lại — không bấm "Bỏ ván" vì sợ nó hỏi lại gì đó (dạng hộp thoại), cứ để vậy rồi ngưng.

**3. Con số**
- Số lần chạm/bấm vào trang: khoảng 9 thao tác chơi thật (1 bấm bắt đầu ván, 6 lần chạm bàn cờ, 1 bấm Gợi ý, 1 bấm Đánh xác nhận).
- Số lần quay lui: 0.
- Số lần bấm/chạm không ra kết quả mong đợi: 1 lần (chạm mạnh tay bị hiểu thành kéo bàn, mất một lượt không đánh được quân).
- Kết quả: chưa xong ván — dừng giữa chừng sau nước đi thứ 6 của mình, không phải bỏ cuộc vì bí mà vì hết "thời gian đợi xe" giả định.
- Bỏ ở bước nào: không bí, không bỏ cuộc do bế tắc.

**4. Ba từ sau khi dùng**
Ba từ: dễ chơi, hơi giật mình (vụ chạm hụt), chắc sẽ mở lại.
Có quay lại không, vì sao: Có — vì đánh được ngay không cần đăng ký gì, máy trả lời nhanh dù mạng chậm. Nhưng lần sau chắc chạm cẩn thận hơn ở giữa bàn, vì lỡ tay kéo lệch là mất nước mà không biết vì sao.
So với ba từ ở phần 1 (gọn gàng, hơi trống, tò mò): bớt "trống" và "tò mò" vì đã biết nó là gì, nhưng thêm chút lăn tăn nhỏ về vụ chạm hụt kia.

**5. Đính kèm thô**

Console log (nguyên trạng):
```
Total messages: 0 (Errors: 0, Warnings: 0)
```

Network requests (nguyên trạng): 22 request, tất cả [200] — HTML, 14 file woff2, 1 css,
6 chunk js, 1 icon.svg. Không có request lỗi.

---

## Ghi chú của người điều phối (không phải lời persona)

- **Không đạt `done_when` của RR-01.** Ván không kết thúc, nên màn hình kết quả, chuỗi năm
  quân được tô, và nút chơi lại đều CHƯA được kiểm chứng trong phiên này. Persona dừng vì
  hết bối cảnh "mười phút đợi xe", không phải vì bế tắc.
- Số bước thực tế tới lúc dừng: 9 / `min_steps` 11 (chưa xong).
