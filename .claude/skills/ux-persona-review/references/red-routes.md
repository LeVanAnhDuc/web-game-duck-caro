# Red Routes — Duck Caro

> Chốt ngày 2026-09-11. Đây là hợp đồng phạm vi: mọi lần chạy về sau đều so với file này.
> Sửa file này là mất khả năng so sánh giữa các lần chạy — chỉ sửa khi sản phẩm đổi bản chất.

**Quy ước `min_steps`:** số hành động người dùng trên đường đi tối ưu. Đoạn chơi thật
(đặt quân, xếp bài) đếm bằng số nước tối thiểu của một người *đã biết chơi* thể loại đó.

**Quy ước `done_when`:** chỉ nói thứ nhìn thấy trên màn hình. Không nhắc tên hàm, tên
component, khoá `localStorage` — persona không được biết những thứ đó.

---

## RR-01 · Đánh trọn một ván với máy

- **id:** RR-01
- **name:** Đánh trọn một ván với máy
- **actor:** người biết đánh caro, chưa từng vào trang này
- **entry:** `https://levananhduc.github.io/web-game-duck-caro/`
- **done_when:** màn hình báo kết quả ván (thắng hoặc thua) hiện ra, chuỗi năm quân
  quyết định được tô rõ và **không bị che** bởi lớp phủ kết quả, và trên đó có một nút
  chơi lại bấm được ngay
- **min_steps:** 11 — 1 chọn mức khó · 1 chọn ai đi trước · 9 nước đặt quân
- **why_red:** đây là toàn bộ lý do sản phẩm tồn tại. Hỏng route này thì không còn gì
  để hỏng nữa
- **status:** live
- **derived_from:** docs/01-product/journeys.md:18 (US-01) · README.md:22 §Features
  "Play against the machine"

## RR-02 · Rời đi giữa ván rồi quay lại đánh tiếp

- **id:** RR-02
- **name:** Rời đi giữa ván rồi quay lại đánh tiếp
- **actor:** người chơi đang dở một ván, đóng tab, mở lại sau
- **entry:** `https://levananhduc.github.io/web-game-duck-caro/` (đã đánh ít nhất 4 nước rồi tải lại trang)
- **done_when:** bàn hiện lại **đủ số quân đã đánh**, đúng lượt đi, đúng mức khó, và
  người chơi đặt được nước tiếp theo mà không phải chọn lại mức khó
- **min_steps:** 1 — đặt nước tiếp theo (không được có bước thiết lập lại nào)
- **why_red:** ván caro dài hơn khoảng chú ý của một lần mở tab. Mất ván đang dở là mất
  người chơi
- **status:** live
- **derived_from:** docs/01-product/journeys.md:52 (US-02)

## RR-03 · Xem lại ván vừa đánh để biết mình sai ở đâu

- **id:** RR-03
- **name:** Xem lại ván vừa đánh để biết mình sai ở đâu
- **actor:** người vừa thua sát sao
- **entry:** `https://levananhduc.github.io/web-game-duck-caro/` (từ màn kết ván của RR-01)
- **done_when:** bàn hiện đúng thế trận tại một nước ở **giữa** ván do người chơi chọn,
  và người chơi thoát ra được về bàn chơi bình thường
- **min_steps:** 3 — vào xem lại · nhảy tới một nước · thoát
- **why_red:** "học được gì sau khi thua" là thứ giữ người chơi lại sau ván thua đầu tiên
- **status:** live
- **derived_from:** docs/01-product/journeys.md:79 (US-03) · README.md:22 §Features

## RR-04 · Đổi mức khó và đọc thành tích của mình

- **id:** RR-04
- **name:** Đổi mức khó và đọc thành tích của mình
- **actor:** người đã thắng mức Thường vài ván, muốn thử mức Khó
- **entry:** `https://levananhduc.github.io/web-game-duck-caro/`
- **done_when:** người chơi đọc được số thắng / thua / bỏ ván **tách riêng theo từng
  mức**, và ván tiếp theo bắt đầu ở mức mới
- **min_steps:** 3 — mở thống kê · chọn mức khác · bắt đầu ván
- **why_red:** mức khó là núm vặn duy nhất của sản phẩm. Không hiểu được nó thì người
  chơi hoặc chán vì dễ, hoặc bỏ vì khó
- **status:** live
- **derived_from:** docs/01-product/journeys.md:104 (US-04)

## RR-05 · Đánh một ván chỉ bằng bàn phím

- **id:** RR-05
- **name:** Đánh một ván chỉ bằng bàn phím
- **actor:** người không dùng chuột và không dùng cảm ứng
- **entry:** `https://levananhduc.github.io/web-game-duck-caro/`
- **done_when:** đặt được ít nhất 3 quân và dịch được khung nhìn **mà không chạm chuột
  lần nào**, với một vòng focus luôn nhìn thấy được
- **min_steps:** 6 — Tab vào bàn · 4 lần mũi tên + Enter · 1 lần Shift+mũi tên
- **why_red:** `overview.md` §6 đặt "chơi trọn ván chỉ bằng bàn phím" làm một trong ba
  tiêu chí thành công của sản phẩm
- **status:** live
- **derived_from:** docs/01-product/overview.md:84 §6.3 · README.md:22 §Features
  "Playable with the keyboard alone"

---

## Đã loại khỏi mọi lượt chạy

| Route | Vì sao loại |
| --- | --- |
| Đo hiệu năng trên điện thoại thật (`NFR-PERF-05`, `NFR-PERF-07`) | không phải hành trình người dùng — là phép đo, và cần thiết bị thật |
| Nghe bốn tiếng bằng tai để xét "có hợp không" | persona chạy trong trình duyệt headless, không nghe được |
