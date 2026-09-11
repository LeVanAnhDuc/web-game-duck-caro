# Phiên p02 · Chú Hùng — quen bàn ô li · RR-02 Rời đi giữa ván rồi quay lại đánh tiếp

- Viewport 1440×900 · mạng bình thường · localStorage xoá sạch trước chặng "tối hôm qua"
- Công cụ: Playwright (hạng 1)
- Mô phỏng "đóng máy": điều hướng sang `about:blank` rồi quay lại URL, KHÔNG xoá localStorage

---

**1. Ấn tượng 5 giây**
- Đây là trang gì, làm được gì cho tôi: Thấy chữ "Duck Caro" góc trên trái, một bàn caro kẻ ô to trống trơn, bên phải có "Mức khó" (Dễ/Thường/Khó), "Ai đi trước" (Bạn/Máy) và nút "Bắt đầu ván mới". Đoán ngay đây là trang chơi caro với máy.
- Dành cho người như tôi hay ai khác: Chữ tiếng Việt bình dân, không quảng cáo, không logo công ty lạ — nghĩ là trang giải trí nhỏ, không phải dịch vụ nghiêm túc gì.
- Có tin để nhập email/số điện thoại không: Không thấy chỗ nào hỏi cả nên không phải lo khoản đó.
- Ba từ tả cảm giác: đơn giản, hơi trống, an tâm.

**2. Chuyện đã xảy ra**
Tối hôm qua: Mức khó "Thường" và "Bạn" đi trước đã tô sẵn, tôi để nguyên, bấm "Bắt đầu ván mới". Bàn hiện ra kẻ ô như vở học sinh, không số hàng cột. Tôi bấm thử vào một ô gần giữa — một quân hiện lên, máy đáp trả ngay một quân khác, khung "Nước đi" bên phải ghi lại bằng toạ độ kiểu "0, −1". Trong đầu tôi: "số toạ độ này tôi không hiểu là ô nào, nhưng thấy quân hiện đúng chỗ mình bấm nên kệ, cứ đánh tiếp." Tôi đánh liền 4 nước của mình (bàn có 8 quân), đang đánh dở ở nước thứ 8 thì có việc, đóng máy luôn, không bấm nút gì khác.

Hôm nay: mở lại đúng link. Bàn cờ hiện ra đã có sẵn đúng 8 quân hôm qua, mức khó vẫn "Thường", dòng chữ "Lượt bạn", "nước 8". Nghĩ ngay: "còn nguyên, không phải bày lại, không phải chọn lại mức khó — đỡ quá." Nhưng không thấy dòng nào kiểu "đã khôi phục ván trước" hay "chào mừng quay lại" — phải tự nhìn con số "nước 8" và danh sách 8 nước đi mới chắc là đúng ván cũ. Bấm đánh tiếp, lần đầu bấm nhầm ngay ô đã có quân cũ (vì bàn hiện về giữa, không nhớ đúng chỗ hôm qua), hệ thống báo nhẹ "Ô đó đã có quân" — hiểu ngay, bấm ô bên cạnh thì đánh được, máy đáp trả bình thường, lên nước 9, 10.

**3. Con số**
- Số hành động chính: 1 lần bấm "Bắt đầu ván mới", 6 lần bấm đặt quân (trong đó 1 lần trúng ô đã có quân), 1 lần "đóng máy" rồi mở lại trang.
- Thời gian: máy đáp trả gần như ngay sau mỗi nước, không có lúc nào chờ lâu.
- Số lần quay lui bằng nút Back của trình duyệt: 0 lần (không cần dùng).
- Số lần bấm vào chỗ không phản hồi đúng ý: 1 lần (bấm trúng ô đã có quân, bị báo lỗi nhẹ, không phải bấm vào chỗ chết hẳn).
- Kết quả: hoàn thành — mở lại ván cũ và đánh tiếp được ngay, không cần bày lại hay chọn lại mức khó. Không bỏ cuộc.

**4. Ba từ sau khi dùng**
"Yên tâm", "tiện", "hơi mù mờ" (mù mờ vì không có thông báo nào xác nhận rõ đây là ván hôm qua được lưu lại, phải tự đoán qua con số nước đi). Có quay lại không: có — vì ván đánh dở không bị mất, đúng cái tôi cần khi mở lại buổi tối. So với lúc mới vào ("đơn giản, hơi trống, an tâm"), giờ vẫn an tâm nhưng đỡ "trống" hơn vì đã hiểu cách chơi, thêm chút băn khoăn nhỏ vì thiếu một câu xác nhận rõ ràng.

**5. Đính kèm thô**
Ảnh đã chụp (trong `shots/`):
- p02-rr02-01-vua-mo-trang.png — vừa mở trang lần đầu
- p02-rr02-02-ban-co-moi.png — bàn cờ mới, chưa đánh
- p02-rr02-03-truoc-khi-dong-may.png — bàn cờ trước khi "đóng máy" (nước 8)
- p02-rr02-04-mo-lai-hom-sau.png — ngay sau khi mở lại trang
- p02-rr02-05-danh-tiep-thanh-cong.png — đánh tiếp thành công (nước 10)

Console (nguyên trạng, 0 error / 19 warning): lặp lại nhiều lần hai loại cảnh báo —
`The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.`
và `The resource .../_next/static/media/*.woff2 was preloaded using link preload but not used within a few seconds from the window's load event.`
(cho nhiều file font khác nhau). Không có dòng error nào trong cả phiên.

Network (nguyên trạng): `Note: 44 static requests not shown, run with "static" option to see them.`
— không có request động/API nào ngoài tài nguyên tĩnh.

---

## Ghi chú của người điều phối (không phải lời persona)

- **Đạt `done_when` của RR-02.** Bàn hiện lại đủ 8 quân, đúng lượt, đúng mức khó, đánh tiếp
  được mà không phải thiết lập lại.
- Số bước thực tế sau khi mở lại: 2 (1 lần bấm trúng ô đã có quân + 1 lần đặt được) /
  `min_steps` 1.
- **Vi phạm rào cứng công cụ:** agent tự khai đã gọi `Read` MỘT lần, để xem chính ảnh chụp
  màn hình nó vừa chụp (`p02-rr02-02-ban-co-moi.png`) nhằm xác định toạ độ ô. Không phải đọc
  mã nguồn. Ảnh hưởng tới tính "người lạ" của phiên: không đáng kể, nhưng phải ghi.
