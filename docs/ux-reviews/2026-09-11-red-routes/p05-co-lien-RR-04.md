# Phiên p05 · Cô Liên — phóng to 200% · RR-04 Đổi mức khó và đọc thành tích

- Viewport 720×450 (= màn 1440×900 ở zoom 200%) · mạng bình thường
- Storage dọn sạch qua CDP, rồi dựng lịch sử bằng cách CHƠI THẬT: 2 lần bắt đầu + bỏ ván ở
  mức Thường (không đụng vào dữ liệu lưu trữ)
- Công cụ: Playwright (hạng 1)

---

## 1. Ấn tượng 5 giây

Mở link ra, chưa bấm gì cả. Tôi thấy chữ to "Duck Caro" ở góc trên, dưới đó có một khối bàn cờ để trống và một bảng nhỏ bên cạnh ghi "Mức khó" với ba nút Dễ/Thường/Khó, "Ai đi trước", rồi nút "Bắt đầu ván mới".

- Đây là trang gì? Chắc là game cờ ca-rô chơi với máy, không phải trang bán hàng hay đăng ký gì.
- Dành cho ai? Có vẻ dành cho người thích chơi cờ giải trí, chữ không quá kỹ thuật.
- Có tin để nhập email/số điện thoại không? Trang này không hỏi gì cả nên không phải lo khoản đó.
- Ba từ tả cảm giác: **gọn, hơi nhỏ, không chắc chắn** (không chắc là chưa thấy cái tôi cần).

## 2. Chuyện đã xảy ra

Tôi đã chơi vài ván mức Thường hôm trước rồi (2 ván bỏ dở), giờ mở lại trang là để: xem mình thắng/thua/bỏ bao nhiêu, xem con số có tách theo từng mức khó không, rồi đổi mức khó khác và bắt đầu ván mới.

Tôi thấy ngay dưới nút "Bắt đầu ván mới" có một dòng chữ nhỏ: "0 thắng · 0 thua · 2 bỏ". Tôi nghĩ "À, đây chắc là tổng thành tích của mình". Dòng này chữ khá bé, tôi phải ghé mắt sát màn hình mới đọc được từng số.

Tôi tò mò không biết số này có tách theo từng mức hay gộp chung, nên bấm vào nút "Cài đặt" xem có mục thống kê theo mức không — nhưng mở ra chỉ thấy Âm thanh, Mức khó mặc định, phím tắt bàn phím, và một nút đỏ "Xoá toàn bộ dữ liệu" nằm khá gần chỗ tôi đang dò. Tôi hơi giật mình, nghĩ bụng "cái nút đỏ này là để xoá hết ván của mình à, lỡ tay bấm nhầm là mất hết" — tôi không dám bấm thử, chỉ đóng lại.

Không thấy chỗ nào ghi rõ "thống kê theo từng mức" cả, nên tôi quay lại màn hình chính, bấm thử đổi sang mức "Khó" xem sao. Ngay khi tôi chọn "Khó", dòng chữ "0 thắng · 0 thua · 2 bỏ" đó **biến mất hẳn**, không còn dòng nào ở đó nữa. Tôi hoang mang một chút, trong đầu nghĩ "ủa, thành tích của tôi đâu rồi, mất tiêu rồi à?" — mất một lúc tôi mới đoán ra là chắc do mức "Khó" tôi chưa chơi ván nào nên nó không hiện gì, còn dòng lúc nãy là của riêng mức "Thường". Nhưng nó không nói thẳng ra điều đó — không có dòng kiểu "Khó: chưa chơi" cho tôi yên tâm, nó chỉ im lặng biến mất.

Sau đó tôi bấm "Bắt đầu ván mới" ở mức Khó, chữ ở góc trên đổi từ "Thường" thành "Khó" — vậy là ván mới bắt đầu đúng như tôi muốn, dù đường đến đó hơi vòng vèo và có đoạn tôi tưởng mình vừa làm mất dữ liệu.

## 3. Con số

- Số bước bấm chính: mở trang → bấm Cài đặt (đi lạc, không có gì) → đóng Cài đặt → chọn "Khó" → bấm "Bắt đầu ván mới" — khoảng 5 bước để hoàn tất cả 3 việc muốn làm.
- 1 lần bối rối rõ rệt (tưởng mất thành tích khi đổi mức).
- 0 lần phải cuộn ngang hay cuộn dọc — màn hình vừa đủ, không tràn.
- Chữ nhỏ hơn mức tôi đọc thoải mái (dưới 16px, phải ghé sát): gần như **toàn bộ** chữ trên trang — nhãn "Mức khó", "Ai đi trước", dòng thành tích, các nhãn trong Cài đặt như "Âm thanh", "Bàn phím" đều chỉ **12px**; ngay cả tên các nút Dễ/Thường/Khó, "Bắt đầu ván mới" cũng chỉ **14px**. Không có dòng chữ nào đạt cỡ dễ đọc ngay từ đầu.

## 4. Ba từ sau khi dùng

**Được việc, nhưng hụt hẫng, thiếu rõ ràng.**

Có quay lại không? Có, vì việc đổi mức và bắt đầu ván mới thì làm được, không bị kẹt cứng. Nhưng tôi sẽ dè dặt hơn mỗi lần đổi mức khó, vì tôi vẫn chưa chắc thành tích của mình có được lưu tách riêng đàng hoàng hay không — nó chỉ "biến mất" chứ không xác nhận. Nếu so với ấn tượng 5 giây ban đầu ("gọn, hơi nhỏ, không chắc chắn"), cảm giác sau khi dùng nghiêng về "không chắc chắn" nhiều hơn — đúng như tôi lo lúc đầu, chứ không được giải toả.

## 5. Đính kèm thô

Ảnh chụp (trong `shots/`):
- `p05-rr04-01-mo-trang-lan-dau.png` — màn hình lúc vừa mở trang (ấn tượng 5 giây)
- `p05-rr04-02-thay-thanh-tich.png` — lúc thấy dòng "0 thắng · 0 thua · 2 bỏ"
- `p05-rr04-03-mo-cai-dat-tim-thanh-tich.png` — mở Cài đặt, thấy nút đỏ "Xoá toàn bộ dữ liệu"
- `p05-rr04-04-chon-muc-kho.png` — ngay sau khi chọn "Khó", dòng thành tích đã biến mất
- `p05-rr04-05-van-moi-muc-kho.png` — màn hình cuối, ván mới đã bắt đầu ở mức "Khó"

Log kỹ thuật thô (lời agent, không phải nhân vật):
- Console: 0 lỗi, 9 cảnh báo — `AudioContext was not allowed to start...` và các cảnh báo
  `resource ... preloaded using link preload but not used` cho file `.woff2`.
- Network: không request lỗi; 22 request tĩnh.
- **Phát hiện kỹ thuật đứng sau sự bối rối ở mục 2:** DOM có sẵn một khối "Thành tích"
  (`<aside class="hidden w-80 ...">`) liệt kê riêng từng mức (Dễ/Thường/Khó, mỗi mức
  "chưa chơi" hoặc số thắng/thua/bỏ) — nhưng khối này bị `display:none` ở viewport 720px
  và **không có nút/toggle nào để mở nó ra ở kích thước này**. Dòng "X thắng · Y thua · Z bỏ"
  ở màn hình chính thực chất ĐÃ là số liệu riêng theo mức đang chọn, nhưng khi đổi sang mức
  chưa chơi ván nào thì dòng đó biến mất hoàn toàn thay vì hiện "chưa chơi".

---

## Ghi chú của người điều phối (không phải lời persona)

- **KHÔNG đạt `done_when` của RR-04.** `done_when` đòi đọc được số thắng/thua/bỏ **tách riêng
  theo từng mức**. Ở vùng nhìn 720×450, bảng thành tích theo mức bị ẩn hoàn toàn và không có
  đường nào mở ra. Cô chỉ thấy một dòng gộp của mức đang chọn, và hiểu nhầm nó là tổng.
  Vế thứ hai của `done_when` — "ván tiếp theo bắt đầu ở mức mới" — thì đạt.
- Số bước thực tế: 5 / `min_steps` 3 (lạc vào Cài đặt 2 bước).
- Đối chiếu với p03/p04 ở 1440×900: hai persona đó **thấy** khung "THÀNH TÍCH" liệt kê cả ba
  mức trong sidebar. Vậy đây là hỏng theo bề rộng màn hình, không phải hỏng chung.
