# Duck Caro — UX persona review · 2026-09-11

> 7 phiên · 7 persona · 5 Red Route
> Công cụ trình duyệt: Playwright (hạng 1) — không degrade hạng công cụ, nhưng ba trục trặc đã
> bóp méo lượt chạy: (1) agent `ux-persona` không khớp tên tool nên cả 7 phiên chạy bằng agent
> trắng `general-purpose` với hướng dẫn vai nhét trong brief; (2) ảnh của p01 bị ghi lạc chỗ và
> suýt bị kết luận nhầm là đã mất — đã tìm lại được đủ; (3) p03 mở trang vào ván đang dở của p02
> vì `localStorage.clear()` bị app ghi đè.
> Red route chốt ngày: 2026-09-11
> Đích đo: bản deploy <https://levananhduc.github.io/web-game-duck-caro/> (nhánh `main`), KHÔNG
> phải code trong thư mục làm việc.

## Ấn tượng đầu

Tính trên toàn bộ persona — ấn tượng đầu chỉ xảy ra một lần.

| Thước | Kết quả |
| --- | --- |
| Đoán đúng đây là trang gì | **6/6** — mẫu chỉ có 6/7 persona |
| Dám nhập email | không đo được — 0/7 persona gặp bất kỳ ô nhập liệu nào |
| Lý do người không dám | không ai từ chối vì trang không hỏi; nhưng ba persona tự nói ra lý do sẽ dè chừng nếu có hỏi: ông Tám (p07) "nhìn trơn trơn vầy tôi cũng không chắc ai làm ra cái này"; chú Hùng (p02) "không có quảng cáo, không logo công ty lạ — nghĩ là trang giải trí nhỏ, **không phải dịch vụ nghiêm túc gì**"; Quân (p06) "đây là đồ chơi giải trí nhẹ nhàng, **không phải sân cho dân thi đấu**" |

**Vì sao mẫu là 6/7:** Hạnh (p03) bị loại khỏi thước "đoán đúng đây là trang gì". Do trục trặc số 3 của lượt chạy, cô mở trang và thấy **bàn cờ đang dở 10 nước của phiên p02** chứ không phải màn hình thiết lập của người mới (`2026-09-11-red-routes/shots/p03-rr05-00-mo-trang.png` — trong ảnh không hề có khối "Đánh caro với máy…/Mức khó/Bắt đầu ván mới" mà 5 persona kia đều tả). Câu trả lời của cô — "một ván cờ ca-rô đang chơi dở, chắc là chơi với máy" — là tả một ván dở, không so sánh được với trang chủ. Phần bàn phím của cô không bị ảnh hưởng và vẫn tính đủ ở RR-05.

Sáu persona còn lại đều đoán đúng: Mai (p01) "Chơi cờ ca-rô với máy"; chú Hùng (p02) "Đoán ngay đây là trang chơi caro với máy"; Bảo (p04) "rõ ràng ngay — một bàn caro chơi với máy, không có gì mập mờ"; cô Liên (p05) "Chắc là game cờ ca-rô chơi với máy"; Quân (p06) "Một ván caro chơi với máy, một-người-một-máy, không hơn". Ông Tám (p07) đúng nhưng **nửa vời, bằng cách loại trừ**: "Tôi đoán là chơi cờ ca-rô với cái máy, nhưng chữ 'caro' tôi không rành lắm, **chỉ đoán mò vì có chữ 'đánh… với máy'**."

**Ba từ trước khi dùng:**
- p01 Mai — "gọn gàng, hơi trống, tò mò"
- p02 chú Hùng — "đơn giản, hơi trống, an tâm"
- p03 Hạnh — "bối rối, hoài nghi, tò mò" *(tả ván dở, không phải trang chủ)*
- p04 Bảo — "gọn, trần trụi, không biết mình sắp đấu với con AI mạnh cỡ nào"
- p05 cô Liên — "gọn, hơi nhỏ, không chắc chắn"
- p06 Quân — "đơn giản — chưa rõ luật — thiếu đối thủ"
- p07 ông Tám — "rối, không chắc, tò mò"

Lặp lại: **"gọn"/"gọn gàng"/"đơn giản" 6/7 persona** — thông điệp hình thức đã tới. **"hơi trống"/"trần trụi" 3/7** (p01, p02, p04). **"tò mò" 3/7** (p01, p03, p07). **"không chắc"/"không chắc chắn" 2/7** (p05, p07), cộng thêm "chưa rõ luật" của p06.

**Ba từ sau khi dùng:**
- p01 Mai — "dễ chơi, hơi giật mình (vụ chạm hụt), chắc sẽ mở lại"
- p02 chú Hùng — "Yên tâm, tiện, **hơi mù mờ**"
- p03 Hạnh — "Nhẹ nhõm, bất ngờ, vẫn còn hơi rén"
- p04 Bảo — "Gọn, đúng ý, **hụt hẫng-nhẹ**"
- p05 cô Liên — "Được việc, nhưng **hụt hẫng**, thiếu rõ ràng"
- p06 Quân — "Gọn — cô đơn — chưa đủ đô"
- p07 ông Tám — "Đỡ rối hơn — chán vì không tự chơi được — **vẫn mù mờ** về cái bàn cờ"

Từ tiêu cực lặp từ 2 người trở lên (theo luật, đây là phát hiện chứ không phải cảm tính):
- **"hụt hẫng"** — p04 và p05, hai Red Route khác nhau, hai kích thước màn hình khác nhau.
- **"mù mờ"** — p02 ("hơi mù mờ" vì không có câu xác nhận ván cũ đã khôi phục) và p07 ("vẫn mù mờ về cái bàn cờ").
- **"giật mình"/"rén"** — p01 ("hơi giật mình" vì cú chạm bị nuốt) và p03 ("vẫn còn hơi rén" vì cú mất dấu focus).

**Đổi theo hướng:** "gọn" sống sót qua cả bảy phiên — không persona nào đổi ý về hình thức. Cái đổi là chữ thứ hai và thứ ba: khi sản phẩm **làm được việc và nói ra mình vừa làm gì**, "trống/tò mò" thành "yên tâm, nhẹ nhõm" (p02, p03); khi nó **làm được việc mà không nói** thì thành "hụt hẫng, mù mờ, chán" (p04, p05, p07). 6/7 nói sẽ quay lại; riêng Quân (p06) nói thẳng "**Không quay lại** — không phải vì máy yếu (máy chặn khá nhạy), mà vì không có đối thủ người thật và luật thi đấu rõ ràng" — đúng như thiết kế của phép thử ngược, đây là thành công của việc giữ Non-Goals.

## Bảng điểm theo Red Route

| Red Route | Hiệu quả | Hiệu suất | Hài lòng |
| --- | --- | --- | --- |
| RR-01 Đánh trọn một ván với máy | **1/2** | 14,5 / 11 (p01 dừng ở 9 bước · p04 kết ván ở ~20 thao tác) | chia đôi: p04 "Gọn, đúng ý, hụt hẫng-nhẹ" · p01 "dễ chơi, hơi giật mình… chắc sẽ mở lại" |
| RR-02 Rời đi giữa ván rồi quay lại | **1/1** | 2 / 1 | tích cực có bảo lưu: "Yên tâm, tiện, hơi mù mờ" |
| RR-03 Xem lại ván vừa đánh | **1/1** | 3 / 3 | tích cực: "cái mình cần có thật và dễ thấy, không phải đoán mò" |
| RR-04 Đổi mức khó và đọc thành tích | **0/1** | 5 / 3 | tiêu cực có bảo lưu: "Được việc, nhưng hụt hẫng, thiếu rõ ràng" |
| RR-05 Đánh một ván chỉ bằng bàn phím | **1/1** | ~25 / 6 | tích cực có sợ hãi còn lại: "Nhẹ nhõm, bất ngờ, vẫn còn hơi rén" |

Ghi chú đọc bảng:

- **RR-01 có hai persona đã thử.** Mai (p01) dừng ở nước thứ 6 của mình vì hết bối cảnh "mười phút đợi xe", không phải vì bế tắc — nên với cô, màn kết quả, chuỗi năm quân và nút chơi lại đều chưa được kiểm chứng. Bảo (p04) chơi trọn 38 nước tới lúc "Máy thắng" hiện ra, và đạt `done_when` (xem phân xử bên dưới). Hiệu suất 14,5/11 là trung vị của 9 và ~20; con số này phần lớn phản ánh **độ dài thật của một ván với máy mức "Thường"** (38 nước, 19 nước của người chơi) chứ không phải ma sát giao diện — `min_steps` 11 giả định một ván thắng trong 9 nước.
- **RR-04 trượt ở vế thứ nhất.** `done_when` đòi đọc được thắng/thua/bỏ **tách riêng theo từng mức**. Ở vùng nhìn 720×450, khối "THÀNH TÍCH" liệt kê cả ba mức biến mất hoàn toàn (đối chiếu `2026-09-11-red-routes/shots/p05-rr04-01…05` với `2026-09-11-red-routes/shots/p04-rr03-01-mo-trang-lan-dau.png` ở 1440×900, nơi khối đó nằm rõ trong sidebar). Vế thứ hai — ván mới bắt đầu ở mức mới — thì đạt: chip góc trên phải đổi thành "Khó" trong `2026-09-11-red-routes/shots/p05-rr04-05-van-moi-muc-kho.png`.
- **RR-05 đạt nhưng đắt.** 8 lần Tab mới chạm được bàn cờ, và lần Tab thứ 5 rơi vào hư không.

## Phân xử bằng ảnh

Ba câu hỏi mà không persona đơn lẻ nào tự trả lời được, và người điều phối giao lại cho lăng kính thị giác.

**1. Chuỗi năm quân quyết định — có được tô rõ không? CÓ.**
Trong `2026-09-11-red-routes/shots/p04-rr03-02-man-hinh-ket-qua-thua.png`, năm quân O của máy ở cột x=−1 (y=−2…2) được nối bằng **một đường kẻ dọc màu xanh lá**, chạy xuyên qua đúng năm ô đó và không chạm quân nào khác. Đây là chỗ duy nhất trên toàn trang có màu xanh lá. Xác nhận rõ hơn ở `2026-09-11-red-routes/shots/p04-rr03-04-man-hinh-cuoi-sau-thoat-xem-lai.png`, nơi bàn đã phóng to: đường xanh nối năm vòng O liền mạch, không thể nhầm với chỗ khác.
Kèm hai bảo lưu: (a) **bản thân năm quân không đổi gì cả** — vẫn đúng màu đỏ nâu, đúng nét, đúng cỡ như mọi quân O khác; toàn bộ dấu hiệu nằm ở một nét kẻ mảnh ~2–3px; (b) ở mức thu phóng lúc kết ván (ảnh 02), nét kẻ đó dài khoảng 120px trên màn 1440 và **ô trên cùng của chuỗi bị khung nét đứt của con trỏ đè lên**. Không có dòng chữ nào giải thích đường xanh ấy là gì.
**Kết luận với `done_when` RR-01:** đạt cả ba vế — bảng kết quả nằm trong sidebar chứ không phải lớp phủ (bàn cờ hiện nguyên vẹn trong ảnh), chuỗi năm quân có dấu phân biệt, và nút "Chơi lại" ở trạng thái nền đen bấm được ngay cạnh "Xem lại".

**2. Nút "Gợi ý" — p04 nói bị khoá, p01 và p07 nói bấm được. Ai đúng? Cả ba, ở ba thời điểm khác nhau.**
Nút bị làm mờ khi **không có ván đang chạy**: trước khi bắt đầu (`p02-rr02-01`, `p04-rr03-01`, `p07-blind-01` — cả "Hoàn", "Gợi ý", "Bỏ ván" đều xám) và sau khi ván kết thúc (`p04-rr03-02`, `p04-rr03-04`, `p06-blind-05` — xám trở lại). Nút bấm được **trong lúc tới lượt người chơi**, ở cả hai kích thước: 1440×900 tại nước 10 (`p03-rr05-00`, `p03-rr05-01` — chữ "Gợi ý" đậm, cùng sắc độ với "Hoàn"/"Giữa") và 375×720 (`p07-blind-04`, `p07-blind-06` — ông Tám bấm và nhận được quân X mờ kèm nút "Đánh").
**Vậy lời khai của Bảo — "bị khoá (disabled) suốt từ đầu tới cuối ván" — là sai về phạm vi**, nhưng đúng ở hai thời điểm anh thực sự nhìn: lúc mới vào và lúc thua xong. Điều đáng giữ lại không phải cái nút, mà là: ở đúng khoảnh khắc một người vừa thua muốn hỏi "lẽ ra tôi phải đánh đâu", cả ba nút trợ giúp đều xám lại cùng lúc (xem F-10).

**3. Nút đỏ "Xoá toàn bộ dữ liệu" có nằm gần chỗ cô Liên đang dò không? KHÔNG.**
`2026-09-11-red-routes/shots/p05-rr04-03-mo-cai-dat-tim-thanh-tich.png` cho thấy tấm "Cài đặt" ở 720×450 chỉ hiện được **hai mục**: "ÂM THANH" và "MỨC KHÓ MẶC ĐỊNH", rồi bị cắt ngang bởi một đường kẻ phân cách ở mép dưới, với thanh cuộn dọc mảnh bên phải. Không có nút đỏ nào trong khung nhìn. Phần "phím tắt" và nút "Xoá toàn bộ dữ liệu" nằm **dưới nếp gấp, phải cuộn bên trong tấm mới thấy**.
Nghĩa là: nỗi sợ cô kể là thật và có giá trị (F-06), nhưng lời giải thích không gian của cô — "nằm khá gần chỗ tôi đang dò" — không được ảnh xác nhận. Cái ảnh xác nhận lại là một chuyện khác, tệ hơn cho RR-04: ở vùng nhìn này, tấm Cài đặt chỉ trưng ra được một nửa nội dung và **không có dấu hiệu nào cho biết còn phần bên dưới** ngoài một thanh cuộn 4px.

## Phát hiện

Xếp theo mức nghiêm trọng giảm dần. Mức đã áp luật nâng bậc: nâng một bậc nếu từ 2 persona trở lên cùng vấp.

### F-01 · Critical · Interaction Design · Visual craft · ISO 9241-11

**Ở đâu:** RR-01 — bàn cờ trên điện thoại 375×720, sau khi bấm "Bắt đầu ván mới"

**Chuyện gì xảy ra:** Trên điện thoại, chạm vào bàn cờ để đặt quân không đáng tin. Một cú chạm hơi xê dịch bị hiểu thành kéo bàn và **không để lại dấu vết nào** — không quân mới, không thông báo, dòng trạng thái đứng yên. Một cú chạm đúng ô đã có quân thì báo "Ô đó đã có quân" rồi dừng ở đó: thông báo nói đúng chuyện gì vừa xảy ra nhưng không cho người chơi đường nào thoát ra — không chỉ ô trống gần nhất, không đánh dấu ô vừa chạm, không nói ô nào là ô nào. Ông Tám lặp câu đó ba lần liền rồi từ bỏ việc tự chọn nước đi.

**Dẫn chứng:**
- p07 ông Tám, bước 2 — "chạm thêm lần nữa y chỗ đó để đánh tiếp — lần này hiện chữ **'Ô đó đã có quân'**. Tôi không hiểu tại sao… **Tôi không biết cái ô đó là ô nào trên tấm hình, và cũng không biết phải chạm chỗ khác ở đâu vì đâu có thấy đường kẻ ô rõ để nhắm**." Con số của ông: "Chạm vào bàn cờ bị báo 'Ô đó đã có quân': **3 lần liền** không đổi được gì khác"; "Chạm thành công đặt được quân cờ: **2 lần — cả hai đều qua 'Gợi ý' → 'Đánh'**, không lần nào tự chạm thẳng vào bàn mà thành công sau nước đầu tiên." — `2026-09-11-red-routes/shots/p07-blind-05-cham-lai-o-da-co-quan.png`
- p01 Mai, bước 2 — "Tới lần chạm thứ ba tôi lỡ tay xê dịch mạnh hơn một chút… Lần này không có gì xảy ra — dòng trạng thái đứng yên y như nước trước, không thấy quân mới. Trong đầu tôi nghĩ: **'ủa sao không thấy gì vậy ta, chắc mình bấm hụt'**." Con số của cô: "Số lần bấm/chạm không ra kết quả mong đợi: 1 lần (chạm mạnh tay bị hiểu thành kéo bàn, **mất một lượt không đánh được quân**)."
- Ảnh xác nhận lời Mai: `2026-09-11-red-routes/shots/p01-rr01-05-ban-bi-keo-le.png` — đúng khoảnh khắc cú chạm bị nuốt. Dòng trạng thái vẫn đọc **"Máy đánh ở 0, -1. Lượt bạn."**, y hệt nước trước; bàn chỉ có 4 quân, không có quân mới nào của cô. Đây là toàn bộ phản hồi mà cô nhận được cho cú chạm đó.
- Quan sát bằng mắt, bổ sung cho cả hai: trên `2026-09-11-red-routes/shots/p07-blind-03-sau-khi-bam-bat-dau.png` và `2026-09-11-red-routes/shots/p01-rr01-05-ban-bi-keo-le.png`, lưới ở mức thu phóng mặc định trên màn 375px có ô rộng **áng chừng 30px** (khoảng 12 ô phủ hết bề ngang), tức dưới ngưỡng vùng chạm 44px thường dùng; và đường kẻ ô là màu nâu rất nhạt trên nền kem, gần như biến mất khi bàn còn trống.

**Bao nhiêu người vấp:** 2/2 persona dùng điện thoại (p01, p07). Không persona desktop nào gặp — chú Hùng (p02) bấm nhầm ô có quân một lần, hiểu ngay và bấm ô bên cạnh: "hệ thống báo nhẹ 'Ô đó đã có quân' — hiểu ngay, bấm ô bên cạnh thì đánh được."

**Hướng xử lý:** Mức cơ sở là High (chặn `done_when` của RR-01 trên thiết bị chạm: ông Tám không đặt được một quân nào do tự chọn ô), nâng lên Critical vì hai persona cùng vấp. Hướng: phân biệt "chạm" với "kéo" trên bàn cờ phải nghiêng hẳn về phía đặt quân, và thông báo lỗi phải kèm một cái neo thị giác trên chính bàn cờ — để người chơi biết ô vừa chạm là ô nào — chứ không chỉ một dòng chữ ở thanh dưới. Hình thức cụ thể để người làm sản phẩm quyết.

### F-02 · High · Trigger words · Visual hierarchy · Visual craft

**Ở đâu:** RR-01 — dòng hướng dẫn duy nhất dưới bàn cờ, ở 375×720

**Chuyện gì xảy ra:** Toàn bộ chỉ dẫn thao tác bàn cờ nằm trong một dòng chữ nhỏ đặt sát mép dưới: "Kéo để di chuyển bàn · lăn chuột để thu phóng". Trên điện thoại, nửa sau của câu nói về một thiết bị không tồn tại ("lăn chuột"), và nửa đầu dùng một động từ mà người dùng ít kinh nghiệm không giải mã được. Cả hai persona điện thoại đều đi qua dòng này mà không thu được gì — một người không đọc, một người đọc mà không hiểu — và cả hai đều trả giá đúng ở chỗ F-01.

**Dẫn chứng:**
- p01 Mai, bước 2 — "hiện bàn cờ trống trơn, có dòng chữ nhỏ 'Kéo để di chuyển bàn · lăn chuột để thu phóng' — **tôi lướt qua không để ý tới**." Và sau cú chạm hụt: "Hoá ra cái kéo tay đó bị hiểu thành 'kéo bàn cờ' chứ không phải đánh quân — **đúng như dòng chữ nhỏ đã ghi nhưng tôi có đọc đâu**."
- p07 ông Tám, bước 2 — "dòng chữ nhỏ có ghi 'kéo để di chuyển bàn' **nhưng tôi không biết kéo là làm sao, tay tôi chỉ biết chạm một cái rồi bỏ ra thôi**, nên tôi không thử kéo." Ở phần ấn tượng đầu ông gọi nó là "một dòng chữ **bé xíu**".
- `2026-09-11-red-routes/shots/p07-blind-03-sau-khi-bam-bat-dau.png`: sau khi bắt đầu ván, toàn màn hình 375×720 chỉ có lưới nhạt trống và đúng một dòng chữ xám nhạt ~12px ở đáy, nội dung là câu "lăn chuột để thu phóng" nói trên. Không có gợi ý nào về nơi bắt đầu đánh, không có dấu tâm bàn.

**Bao nhiêu người vấp:** 2/2 persona dùng điện thoại.

**Hướng xử lý:** Mức cơ sở Medium (tốn thêm bước), nâng lên High vì hai persona. Hướng: chỉ dẫn thao tác phải nói đúng ngôn ngữ của thiết bị đang dùng, và phải đứng ở nơi mắt đi qua trước khi tay chạm — không phải ở cỡ chữ nhỏ nhất trang, tại mép dưới cùng.

### F-03 · High · Interaction Design · ISO 9241-11

**Ở đâu:** RR-05 — vòng Tab trên desktop 1440×900, ngay sau nút "Bỏ ván"

**Chuyện gì xảy ra:** Trong chuỗi Tab đi từ đầu trang tới bàn cờ, có đúng một chặng mà vòng focus **biến mất khỏi màn hình**: sau nút "Bỏ ván", lần Tab kế tiếp không làm sáng gì cả. Người chỉ dùng bàn phím mất hoàn toàn dấu vết vị trí của mình ngay trước khi tới được thứ duy nhất đáng dùng của sản phẩm — bàn cờ, vốn nằm ở mãi lần Tab thứ 8.

**Dẫn chứng:**
- p03 Hạnh, bước 2 — "Rồi đến cú Tab thứ năm — **mọi thứ biến mất**. Không có viền sáng ở đâu cả, màn hình y như không có gì đang được chọn. Đúng cái khoảnh khắc mà tôi vẫn sợ nhất: mất dấu giữa chừng, không biết phím mũi tên hay Enter tiếp theo sẽ rơi vào đâu. **Bình thường đây là lúc tôi đóng tab luôn, không thử lại**."
- p03 Hạnh, phần 4 — "nếu hôm đó tôi không cố kiên nhẫn bấm thêm một Tab nữa (**đúng cái tôi tự nhận là mình không làm**), tôi đã đóng tab và kết luận 'trang này bỏ rơi mình' ngay tại chỗ, **trước khi kịp biết bàn cờ chơi được**."
- `2026-09-11-red-routes/shots/p03-rr05-02-tab-5-mat-dau-focus.png` — so với `p03-rr05-00-mo-trang.png` (chưa bấm gì) và `p03-rr05-01-tab-1-hoan.png` (viền xanh 2px rõ ràng quanh nút "Hoàn"): ảnh Tab #5 **không khác gì ảnh chưa bấm phím nào**, không có viền sáng ở bất kỳ đâu trong khung nhìn. Đối chiếu khớp với dump thô của phiên: `Tab #5: {tagName: BODY, vienFocus: "none"}`.
- Ghi chú của người điều phối cùng phiên: "Cú mất dấu focus ở Tab #5 vượt đúng `patience_threshold` = 2 của persona này."

**Bao nhiêu người vấp:** 1/1 persona chỉ dùng bàn phím.

**Hướng xử lý:** Mức High, không nâng bậc (chỉ một persona đi đường này). Nhưng nó chặn `done_when` của RR-05 với bất kỳ người dùng bàn phím nào ít kiên nhẫn hơn brief, và RR-05 bắt nguồn từ `overview.md` §6.3 — một trong ba tiêu chí thành công tự đặt ra. Hướng: không được để tồn tại một chặng nào trong vòng Tab mà không có gì nhìn thấy được; đồng thời xem lại vì sao bàn cờ — thứ duy nhất người ta vào đây để dùng — lại đứng sau bốn nút sự vụ và hai nút tiện ích trong thứ tự Tab.

### F-04 · High · LATCH · Visual hierarchy · Trust & desirability

**Ở đâu:** RR-04 — khối thành tích, ở vùng nhìn 720×450 (màn 1440×900 phóng 200%)

**Chuyện gì xảy ra:** Thành tích tách theo từng mức khó chỉ tồn tại ở màn rộng. Ở vùng nhìn hẹp, khối "THÀNH TÍCH" ba dòng Dễ/Thường/Khó biến mất hoàn toàn và không có nút nào mở nó ra; thứ duy nhất còn lại là một dòng "0 thắng · 0 thua · 2 bỏ" 12px, **bị cắt mất nửa dưới ở mép khung**. Dòng đó thực ra là số liệu của riêng mức đang chọn, nhưng không có gì nói vậy — nên khi cô Liên đổi sang mức "Khó" (chưa chơi ván nào), nó **im lặng biến mất** thay vì nói "chưa chơi". Cô hiểu nhầm theo đúng hai nấc liên tiếp: trước tưởng đó là tổng, sau tưởng mình vừa làm mất dữ liệu.

**Dẫn chứng:**
- p05 cô Liên, bước 2 — "Tôi thấy ngay dưới nút 'Bắt đầu ván mới' có một dòng chữ nhỏ: '0 thắng · 0 thua · 2 bỏ'. Tôi nghĩ **'À, đây chắc là tổng thành tích của mình'**. Dòng này chữ khá bé, tôi phải ghé mắt sát màn hình mới đọc được từng số."
- p05 cô Liên, bước 2 — "Ngay khi tôi chọn 'Khó', dòng chữ… **biến mất hẳn**… Tôi hoang mang một chút, trong đầu nghĩ **'ủa, thành tích của tôi đâu rồi, mất tiêu rồi à?'**… Nhưng nó không nói thẳng ra điều đó — không có dòng kiểu 'Khó: chưa chơi' cho tôi yên tâm, **nó chỉ im lặng biến mất**."
- p05 cô Liên, phần 4 — "tôi vẫn chưa chắc thành tích của mình có được lưu tách riêng đàng hoàng hay không — **nó chỉ 'biến mất' chứ không xác nhận**."
- Ảnh, đối chiếu bốn tấm: `2026-09-11-red-routes/shots/p05-rr04-02-thay-thanh-tich.png` — dòng thành tích nằm ở đúng mép dưới của khối thiết lập và **bị xén ngang thân chữ**, chỉ đọc được nửa trên; `2026-09-11-red-routes/shots/p05-rr04-04-chon-muc-kho.png` — cùng khung hình đó sau khi chọn "Khó", chỗ ấy trống trơn; `2026-09-11-red-routes/shots/p05-rr04-05-van-moi-muc-kho.png` — toàn màn hình chỉ còn lưới trống, không còn bất kỳ số liệu nào; đối chứng `2026-09-11-red-routes/shots/p04-rr03-01-mo-trang-lan-dau.png` và `2026-09-11-red-routes/shots/p03-rr05-00-mo-trang.png` ở 1440×900 — khối "THÀNH TÍCH" liệt kê đủ ba dòng Dễ/Thường/Khó nằm rõ trong sidebar.
- Ghi chú kỹ thuật của chính phiên (lời agent): khối `<aside class="hidden w-80 …">` liệt kê riêng từng mức bị `display:none` ở 720px và "**không có nút/toggle nào để mở nó ra ở kích thước này**".

**Bao nhiêu người vấp:** 1/1 persona ở vùng nhìn hẹp. Hai persona ở 1440×900 (p03, p04) đều **thấy** khối ba dòng — nên đây là hỏng theo bề rộng màn hình, không phải hỏng chung.

**Hướng xử lý:** Mức High — chặn thẳng vế thứ nhất của `done_when` RR-04, và RR-04 tồn tại vì mức khó là núm vặn duy nhất của sản phẩm. Hướng có hai nhánh tách biệt: (1) số liệu theo mức phải với tới được ở mọi bề rộng — ẩn hẳn một khối thông tin mà không để lại lối vào là mất luôn nội dung đó, không phải thu gọn; (2) trạng thái "chưa có dữ liệu" phải được nói ra, vì với người dùng, một dòng số biến mất và một dòng số bị xoá trông giống hệt nhau.

### F-05 · Medium · Visual craft · Form design

**Ở đâu:** toàn trang; bộc lộ rõ nhất ở RR-04, vùng nhìn 720×450

**Chuyện gì xảy ra:** Không có dòng chữ nào trên trang đạt cỡ đọc thoải mái ngay từ đầu, và ở vùng nhìn hẹp khối thiết lập còn bị xén cả trên lẫn dưới. Ba persona ở ba bối cảnh khác nhau đều tự nhắc tới cỡ chữ mà không ai hỏi.

**Dẫn chứng:**
- p05 cô Liên, phần 3 — "Chữ nhỏ hơn mức tôi đọc thoải mái (dưới 16px, phải ghé sát): **gần như toàn bộ chữ trên trang** — nhãn 'Mức khó', 'Ai đi trước', dòng thành tích, các nhãn trong Cài đặt như 'Âm thanh', 'Bàn phím' đều chỉ **12px**; ngay cả tên các nút Dễ/Thường/Khó, 'Bắt đầu ván mới' cũng chỉ **14px**. **Không có dòng chữ nào đạt cỡ dễ đọc ngay từ đầu.**"
- p07 ông Tám, phần 1 — "Cuối cùng có một dòng chữ **bé xíu**: 'Kéo để di chuyển bàn · lăn chuột để thu phóng'."
- p01 Mai, bước 2 — "có **dòng chữ nhỏ** 'Kéo để di chuyển bàn…' — tôi lướt qua không để ý tới."
- Ảnh: `2026-09-11-red-routes/shots/p05-rr04-01-mo-trang-lan-dau.png` — ở 720×450, tấm thiết lập bị **cắt cụt cả hai đầu**: câu mô tả luật mất dòng đầu, và phần dưới nút "Bắt đầu ván mới" bị xén; dấu hiệu duy nhất báo còn nội dung là một thanh cuộn mảnh ở mép phải. `2026-09-11-red-routes/shots/p05-rr04-03-mo-cai-dat-tim-thanh-tich.png` — tấm Cài đặt cũng chỉ trưng được hai trong bốn mục, cắt ngang giữa chừng. Trên 1440×900 các con chữ nhất quán và sạch (`p04-rr03-01`), nên đây là vấn đề cỡ chữ + khả năng chịu thu hẹp, không phải vấn đề tay nghề dàn trang.

**Bao nhiêu người vấp:** 3/7 persona tự nêu (p01, p05, p07).

**Hướng xử lý:** Mức cơ sở Low (gây khó chịu, không cản trở), nâng lên Medium vì ba persona. Hướng: chọn một cỡ chữ nền đủ đọc rồi mới dựng thang bậc từ đó, và thử lại toàn bộ các tấm nổi ở chiều cao khung nhìn nhỏ — nơi phóng to 200% đưa người dùng tới.

### F-06 · Medium · Trigger words · Interaction Design · Trust & desirability

**Ở đâu:** RR-01 và RR-04 — nút "Bỏ ván" ở thanh dưới, và nút đỏ "Xoá toàn bộ dữ liệu" trong Cài đặt

**Chuyện gì xảy ra:** Sản phẩm có hai nút phá huỷ dữ liệu, cả hai đều không nói trước hậu quả, và **không persona nào dám bấm thử** — mỗi người tự dựng ra một nỗi sợ khác nhau để tránh. Trớ trêu là nỗi sợ của Mai hướng đúng vào chỗ không có gì: "Bỏ ván" **không hỏi lại một câu nào**, bấm một cái là ván kết thúc ngay và được ghi vào thành tích.

**Dẫn chứng:**
- p01 Mai, bước 2 — "không bấm 'Bỏ ván' vì **sợ nó hỏi lại gì đó (dạng hộp thoại)**, cứ để vậy rồi ngưng."
- p05 cô Liên, bước 2 — "một nút đỏ 'Xoá toàn bộ dữ liệu'… Tôi hơi giật mình, nghĩ bụng **'cái nút đỏ này là để xoá hết ván của mình à, lỡ tay bấm nhầm là mất hết'** — **tôi không dám bấm thử**, chỉ đóng lại."
- Ảnh, phân xử: so `2026-09-11-red-routes/shots/p06-blind-04-quyet-dinh-bo-di.png` (đang chơi, nước 4, mức Khó) với `2026-09-11-red-routes/shots/p06-blind-05-man-hinh-cuoi.png` (ngay sau khi Quân bấm "Bỏ ván") — giữa hai ảnh **không có bước xác nhận nào**; trạng thái nhảy thẳng sang "Bạn đã bỏ ván", và dòng "Khó" trong THÀNH TÍCH đổi từ "chưa chơi" thành "0 thắng · 0 thua · **1 bỏ**". Còn nút đỏ mà cô Liên sợ thì, ở vùng nhìn của cô, **không nằm trong khung hình** (`p05-rr04-03` chỉ hiện "Âm thanh" và "Mức khó mặc định") — tức nỗi sợ có thật nhưng lời giải thích không gian của cô thì không.
- Bối cảnh làm nỗi sợ này đắt hơn, và ảnh của chính phiên Mai xác nhận: trên điện thoại, nút "Bỏ ván" rút còn **một biểu tượng cờ đỏ không nhãn** ở góc phải thanh dưới, đứng ngay cạnh "Hoàn · Gợi ý · Giữa" — ba nút đều có chữ, riêng nó thì không (`2026-09-11-red-routes/shots/p01-rr01-05-ban-bi-keo-le.png`, `2026-09-11-red-routes/shots/p07-blind-04-cham-vao-ban-co.png`).

**Bao nhiêu người vấp:** 2/7 persona (p01, p05) — hai nút khác nhau, cùng một kiểu né tránh.

**Hướng xử lý:** Mức cơ sở Low (không ai bị mất gì), nâng lên Medium vì hai persona. Hướng: nhãn của một hành động phá huỷ nên nói ra cái mất, và mức độ "hỏi lại" nên tương xứng với thiệt hại — hiện tại hai nút này đang ngược nhau: cái người ta sợ bị hỏi lại thì không hỏi gì cả.

### F-07 · Medium · Trigger words · Visual hierarchy

**Ở đâu:** RR-01 (phiên mù) — trang chủ ở 375×720, trước khi bắt đầu ván

**Chuyện gì xảy ra:** Người dùng ít kinh nghiệm số áp dụng đúng quy tắc "cái gì đọc được là cái bấm được" và mất ba thao tác vào hư không: tiêu đề "Duck Caro" (hai lần) và đoạn chữ luật chơi (một lần). Cả ba lần trang không phản hồi gì — không có chuyển động, không có câu nào nói "đây chỉ là chữ".

**Dẫn chứng:**
- p07 ông Tám, bước 2 — "Tôi lấy ngón tay chạm vào chữ 'Duck Caro' ở trên cùng, tưởng nó như cái tên, bấm vô coi có mở ra gì không — **im re, chẳng có gì**. Chạm thêm lần nữa (nghĩ chắc lúc nãy máy nó chưa kịp), vẫn im re. Tôi bèn chạm vào đoạn chữ giải thích luật chơi, nghĩ bụng **'chữ đọc được chắc bấm được'**, chờ coi nó dẫn qua trang khác không — cũng chẳng có gì xảy ra."
- p07, phần 3 — "Chạm không có tác dụng gì (chạm vào chữ tên trang, chạm vào đoạn giải thích luật): **3 lần**" trên tổng 12 lần chạm cả phiên, tức **một phần tư số thao tác của ông rơi vào chỗ chết**.
- `2026-09-11-red-routes/shots/p07-blind-02-cham-vao-tieu-de.png` so với `2026-09-11-red-routes/shots/p07-blind-01-vua-mo-trang.png`: hai ảnh giống hệt nhau từng điểm ảnh — không có bất kỳ dấu vết phản hồi nào sau hai cú chạm.

**Bao nhiêu người vấp:** 1/7 persona, nhưng là persona duy nhất đại diện cho trình độ số thấp — và nó tiêu tốn 3/12 thao tác đầu tiên của ông, trước khi ông tìm ra nút thật.

**Hướng xử lý:** Mức Medium (chỉ tốn thêm bước), không nâng bậc. Hướng: trên màn hình đầu tiên, thứ bậc thị giác cần tách rõ "chữ để đọc" khỏi "chữ để bấm" — hiện tại nút thật ("Bắt đầu ván mới") và đoạn văn luật chơi nằm trong cùng một tấm, cùng một hệ chữ, và nút chỉ khác ở nền đen.

### F-08 · Low · Interaction Design · Trust & desirability

**Ở đâu:** RR-02 — màn hình ngay sau khi mở lại trang

**Chuyện gì xảy ra:** Ván cũ được khôi phục đầy đủ và đúng, nhưng sản phẩm không nói một câu nào về việc đó. Người chơi phải tự đối chiếu con số "nước 8" và danh sách nước đi mới dám tin đây là ván hôm qua chứ không phải một ván lạ.

**Dẫn chứng:**
- p02 chú Hùng, bước 2 — "Bàn cờ hiện ra đã có sẵn đúng 8 quân hôm qua, mức khó vẫn 'Thường'… Nghĩ ngay: 'còn nguyên, không phải bày lại, không phải chọn lại mức khó — đỡ quá.' **Nhưng không thấy dòng nào kiểu 'đã khôi phục ván trước' hay 'chào mừng quay lại' — phải tự nhìn con số 'nước 8' và danh sách 8 nước đi mới chắc là đúng ván cũ.**"
- p02, phần 4 — ba từ sau khi dùng: "Yên tâm, tiện, **'hơi mù mờ' (mù mờ vì không có thông báo nào xác nhận rõ đây là ván hôm qua được lưu lại, phải tự đoán qua con số nước đi)**."
- `2026-09-11-red-routes/shots/p02-rr02-04-mo-lai-hom-sau.png` so với `2026-09-11-red-routes/shots/p02-rr02-03-truoc-khi-dong-may.png`: bàn cờ và danh sách 8 nước hiện lại y nguyên; ô trạng thái phía trên chỉ ghi "Lượt bạn", **không có dòng nào nhắc tới việc khôi phục**.

**Bao nhiêu người vấp:** 1/1 persona đi đường này. Không nâng bậc. Cùng họ với F-04 (sản phẩm đổi trạng thái quan trọng mà không nói) nhưng để riêng để không tính hai lần cùng một persona.

**Hướng xử lý:** Mức Low — RR-02 vẫn đạt, chi phí chỉ là một thoáng nghi ngờ. Hướng: chỗ nào sản phẩm tự ý quyết định thay người dùng (khôi phục ván) thì nên để lại một câu, vì đó chính là chỗ người dùng đang tự hỏi "có phải ván của tôi không".

### F-09 · Low · Trigger words · Trust & desirability

**Ở đâu:** trang chủ — câu mô tả luật, dòng đầu tiên người dùng đọc

**Chuyện gì xảy ra:** Câu "Đánh caro với máy trên một bàn không có biên. Năm quân liền là thắng — trừ khi bị chặn cả hai đầu." là luật caro Việt, nhưng câu chữ không nói ra rằng đây là một biến thể. Người **biết chơi** đọc xong mơ hồ hơn chứ không rõ hơn, vì nó mâu thuẫn với luật họ đã thuộc.

**Dẫn chứng:**
- p06 Quân, bước 2 — "Câu 'năm quân liền là thắng — trừ khi bị chặn cả hai đầu' cũng làm tôi **khựng lại** một chút — trong luật tôi biết, năm quân liền là thắng bất kể có bị chặn hay không… Nghĩ trong đầu: **'luật này viết ngược với cái tôi biết, hay đây là luật riêng của họ?'**"
- p06, phần 1 — ba từ trước khi dùng có sẵn "**chưa rõ luật**"; ba từ sau khi dùng vẫn không được giải toả.
- p06, phần 3 — một trong đúng hai bước bế tắc khiến anh rời đi: "không tìm thấy luật renju/chi tiết luật ở đâu ngoài **một dòng mô tả mơ hồ**" — anh đã mở Cài đặt để tìm và không có gì (`2026-09-11-red-routes/shots/p06-blind-01-mo-trang-lan-dau.png` cho thấy đây đúng là toàn bộ phần luật có trên màn hình đầu).

**Bao nhiêu người vấp:** 1/7. Không nâng bậc.

**Hướng xử lý:** Mức Low, và cần đọc kèm bối cảnh: Quân là negative persona, việc anh bỏ đi vì thiếu PvP và thiếu bảng xếp hạng là **thành công** của Non-Goals, không phải lỗi. Cái đáng giữ lại chỉ là một mẩu: câu luật ngắn ấy hiện đang phục vụ người chưa biết chơi (ông Tám vẫn không hiểu "caro" là gì sau khi đọc) lẫn người đã biết chơi (Quân thấy nó ngược), và không phục vụ trọn vẹn ai cả.

### F-10 · Low · Interaction Design · Visual hierarchy

**Ở đâu:** RR-01/RR-03 — cụm "Hoàn · Gợi ý · Giữa · Bỏ ván" tại màn hình kết quả

**Chuyện gì xảy ra:** Bốn nút sự vụ luôn ở nguyên chỗ, chỉ đổi độ mờ theo ngữ cảnh. Ở màn hình kết quả, ba trong bốn nút xám lại cùng lúc. Hệ quả là người chơi không đọc ra được đây là "tạm thời không dùng được" hay "vốn không dùng được" — Bảo chơi trọn 38 nước rồi kết luận sai rằng nút "Gợi ý" hỏng suốt ván.

**Dẫn chứng:**
- p04 Bảo, phần 4 — "**Nút 'Gợi ý' (Hint) có tồn tại nhưng bị khoá (disabled) suốt từ đầu tới cuối ván** — cái này thì hơi lạ, đáng ra mình sẽ thử bấm thử xem gợi ý là gì."
- Phân xử bằng ảnh (chi tiết ở mục "Phân xử bằng ảnh" §2): nút **bấm được** trong lượt của người chơi ở cả hai kích thước — `2026-09-11-red-routes/shots/p03-rr05-00-mo-trang.png` (1440×900, nước 10), `2026-09-11-red-routes/shots/p07-blind-06-bam-goi-y.png` (375×720, ông Tám bấm và nhận được nước đề xuất kèm nút "Đánh") — và **xám** khi không có ván đang chạy: `2026-09-11-red-routes/shots/p04-rr03-01-mo-trang-lan-dau.png` (trước khi bắt đầu), `2026-09-11-red-routes/shots/p04-rr03-02-man-hinh-ket-qua-thua.png` và `2026-09-11-red-routes/shots/p04-rr03-04-man-hinh-cuoi-sau-thoat-xem-lai.png` (sau khi thua). Lời khai của Bảo sai về phạm vi, nhưng đúng ở hai thời điểm anh thực sự nhìn.
- Vì sao đáng ghi chứ không bỏ qua: p04 Bảo, bước 2 — "chơi thua mà **không hề có cảnh báo/gợi ý** kiểu 'máy đang dựng 3 quân ở cột x=−1' lúc đang chơi — phải thua xong, vào Xem lại, tự lần từng nước mới hiểu ra chỗ hỏng." Đúng khoảnh khắc một người vừa thua muốn hỏi "lẽ ra tôi phải đánh đâu" thì cả ba nút trợ giúp đều xám.

**Bao nhiêu người vấp:** 1/7 hiểu sai trạng thái nút. Không nâng bậc.

**Hướng xử lý:** Mức Low. Hướng: trạng thái mờ kéo dài mà không kèm lý do sẽ bị đọc thành "hỏng"; nếu một nút không dùng được ở màn hình kết quả thì cần cân nhắc nó có nên ở đó không.

## Không phát hiện được gì ở

- **RR-03 · Xem lại ván vừa đánh — sạch, và là Red Route duy nhất đi đúng đường tối ưu không lệch một bước.** 3/3 bước. p04 Bảo, bước 2: "Ngay dưới dòng 'Máy thắng' là hai nút nằm cạnh nhau: 'Chơi lại' và 'Xem lại'. **Không cần tìm kiếm gì cả — đúng cái mình cần lại nằm sẵn ngay đó**, không phải lục menu hay cuộn xuống đâu xa." Nhảy tới nước 19/38 chính xác, thoát ra "quay lại y nguyên màn hình kết quả ban đầu — **không bị văng ra chỗ khác, không mất trạng thái**". Ảnh `2026-09-11-red-routes/shots/p04-rr03-03-xem-lai-nuoc-giua.png` xác nhận: chỉ báo "Đang xem lại 19/38", nước 19 được viền xanh trong danh sách, các nước từ 20 trở đi làm mờ đúng nghĩa.
- **Cơ chế lưu ván của RR-02 — phần lõi không có gì để chê.** Bàn hiện lại đủ 8 quân, đúng lượt, đúng mức khó, đánh tiếp được ngay (`2026-09-11-red-routes/shots/p02-rr02-04`, `p02-rr02-05`). Cái thiếu là một câu xác nhận (F-08), không phải cơ chế.
- **Bàn cờ dưới bàn phím — phần được khen mạnh nhất của cả lượt chạy.** p03 Hạnh, bước 2: "bàn cờ có nói cho tôi biết cách chơi: 'Bàn caro. Mũi tên dịch con trỏ, Enter đánh, Shift và mũi tên kéo bàn, Home về giữa.' **Đây là lần đầu tiên một trang tự giải thích phím tắt mà không cần tôi đoán mò.**" Và dòng trạng thái theo con trỏ: "'Con trỏ ở 2, 1. Ô trống.' — **biết chính xác mình đang đứng ở ô nào, ô đó trống hay có quân của ai**." 3/3 quân đặt được, 2/2 thao tác dịch khung nhìn thành công. Đối chiếu ngược: chính thông tin này — ô nào trống, con trỏ ở đâu — là thứ ông Tám trên điện thoại không có và bị chặn đứng vì thiếu nó (F-01).
- **Phản hồi của máy dưới mạng chậm.** p01 Mai (4G chậm 400kbps): "máy trả lời nhanh dù mạng chậm"; p02 chú Hùng: "máy đáp trả gần như ngay sau mỗi nước, không có lúc nào chờ lâu"; p06 Quân, người khó tính nhất: "Máy đáp trả **gần như ngay lập tức**… Phản ứng nhanh, đúng chỗ, không có gì để chê về mặt chiến thuật cơ bản."
- **Sức khoẻ kỹ thuật ở mọi phiên:** 0 lỗi console trong cả 7 phiên, 0 request lỗi mạng, không có request nào đi ra ngoài tài nguyên tĩnh (p07 ghi nhận đúng điểm này: "Network: chỉ tài nguyên tĩnh, **không gửi thông tin cá nhân đi đâu**").
- **Giữ Non-Goals:** xem F-09 — Quân rời đi ở hành động thứ 9 sau đúng 2 bước bế tắc, và nói rõ vì thấy gì. Đây là kết quả đúng như thiết kế của phép thử ngược.

## Ghi chú về chính lần chạy này

**Những gì bóp méo kết quả:**

1. **Cả 7 phiên chạy bằng agent trắng.** Agent `ux-persona` khai `tools: mcp__playwright__*` trong khi tên thật của bộ tool là `mcp__plugin_playwright_playwright__*`, nên không nhận được tool nào dùng được. Cách đi vòng: `general-purpose` + nguyên văn hướng dẫn vai trong brief. Tính "người lạ" vẫn giữ được (agent khởi động không mang context), nhưng rào chặn tool chỉ là câu chữ — p02 tự khai đã gọi `Read` một lần để xem chính ảnh nó vừa chụp nhằm xác định toạ độ ô. Không đọc mã nguồn. **Đã sửa dòng `tools:` trong `.claude/agents/ux-persona.md` thành danh sách liệt kê đầy đủ; có hiệu lực từ phiên Claude Code sau.**
2. **Ảnh của p01 bị ghi lạc chỗ, và suýt bị kết luận nhầm là đã mất.** Phiên p01 chạy trước khi người điều phối phát hiện phải truyền `filename` cho `browser_take_screenshot`, nên 8 tấm ảnh của nó được ghi vào **gốc repo** thay vì thư mục run. Lệnh tìm file lúc đó không ra kết quả, nên cả `ux-expert` lẫn báo cáo bản đầu đều làm việc với giả định "ảnh p01 đã mất vĩnh viễn" và mọi phát hiện gắn với Mai chỉ dựa vào lời kể. **Ảnh đã tìm lại được đủ 8 tấm** trước khi commit, và hai tấm then chốt đã được đưa vào làm dẫn chứng ở F-01 và F-06. Không phát hiện nào phải sửa kết luận — ảnh xác nhận đúng lời kể.
3. **Một tấm ảnh chụp bù đã từng sai và đã bị xoá.** Trong lúc tưởng ảnh p01 đã mất, người điều phối chụp bù một tấm màn hình mở đầu ở 375×720. Bản đầu của tấm đó dính đúng lỗi storage ở mục 4 dưới đây — nó là bàn cờ giữa ván, không phải màn hình mở đầu; `ux-expert` phát hiện ra khi đối chiếu với `p05-rr04-01` và `p07-blind-01`. Tấm ấy đã được chụp lại cho đúng, rồi bị xoá hẳn khi ảnh gốc của p01 được tìm thấy, vì nó chỉ là bản trùng lặp và không phải ảnh của persona.
4. **p03 mở vào ván dở của p02**, nên bị loại khỏi thước "đoán đúng đây là trang gì" (mẫu 6/7, đã nói rõ ở phần Ấn tượng đầu). Phần bàn phím — lõi của RR-05 — không bị ảnh hưởng và tính đủ. Nguyên nhân: `localStorage.clear()` chạy trên trang đang mở bị chính app ghi đè lại trước lần tải kế tiếp. Từ p04 trở đi đã đổi sang `Storage.clearDataForOrigin` qua CDP khi app đã bị gỡ khỏi trang, và mỗi phiên đều xác nhận thấy "nước 0" trước khi bắt đầu.
5. **Chạy tuần tự, không song song**, do máy chủ MCP Playwright chỉ có một instance trình duyệt dùng chung. Trần 4 phiên đồng thời của `orchestration.md` không dùng được ở đây. Chỉ giãn thời gian, không cắt phạm vi: vẫn đủ 5 Red Route + 2 phiên mù.
6. **Âm thanh: không đo được.** Console của cả 7 phiên lặp lại `The AudioContext was not allowed to start…`; không phiên nào nghe được gì. Đúng như `red-routes.md` đã loại trừ từ đầu — báo cáo này không kết luận gì về âm thanh, kể cả về nút loa ở góc trên phải.
7. **Hiệu năng trên thiết bị thật: ngoài phạm vi từ đầu.** Các nhận xét về tốc độ phản hồi ở trên là cảm nhận của persona dưới throttle giả lập, không phải phép đo.
8. **Số persona cho mỗi Red Route quá nhỏ để đọc như thống kê.** Bốn trong năm Red Route chỉ có đúng một persona thử. Cột "Hiệu quả" nên đọc là "đã xảy ra / chưa xảy ra", không phải tỉ lệ. Chỗ duy nhất có sức nặng thống kê trong lượt này là **các phát hiện có từ hai persona trở lên cùng vấp** (F-01, F-02, F-05, F-06) — và cả bốn đều là những thứ không persona đơn lẻ nào tự nhìn ra được.

---

Log thô từng phiên: [`2026-09-11-red-routes/`](2026-09-11-red-routes/) ·
ảnh của các phát hiện Critical/High: [`2026-09-11-red-routes/shots/`](2026-09-11-red-routes/shots/) ·
bản gốc đầy đủ (gitignored): `.claude/skills/ux-persona-review/runs/2026-09-11/`
