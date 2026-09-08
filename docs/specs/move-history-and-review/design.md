# Thiết kế · Lịch sử nước đi, xem lại ván, gợi ý

**Liên quan:** FR-08 · FR-09 · FR-10 · US-03 · NFR-A11Y-02 · NFR-A11Y-03 · NFR-A11Y-06 ·
NFR-PERF-06 · NFR-REL-01 · ADR-0003 · ADR-0007 · ADR-0016 · ADR-0017 · ADR-0018

Mốc 5. Ba chức năng đi chung một tài liệu vì chúng đi chung **một** cấu trúc dữ liệu:
`state.moves`, vốn đã là nguồn đúng từ mốc 1 (bất biến 1).

---

## 1. Ba chức năng, và vì sao chúng là một feature

| ID | Chức năng | Đi trên |
| --- | --- | --- |
| FR-08 | Danh sách nước đi | `state.moves` |
| FR-09 | Xem lại ván, chỉ đọc | `state.moves.slice(0, n)` |
| FR-10 | Gợi ý nước đi | `engine.bestMove(state.moves, 'human', 'hard')` |

Không cái nào cần một mảng thứ hai, một bản sao bàn, hay một trạng thái lưu thêm. Tách
chúng ra ba feature sẽ tạo ba lần sửa chồng lên cùng `useGame` và cùng cột phải.

## 2. Xem lại là một PHÉP CHIẾU, không phải một trạng thái song song

Đây là quyết định chịu lực của cả mốc này.

Chế độ xem lại thêm đúng **một** số vào state: `reviewAt: number | null`. `null` là không
xem lại. Mọi thứ khác **dẫn xuất**:

```
bàn hiển thị      = moves.slice(0, reviewAt ?? moves.length)
nét gạch thắng    = chỉ vẽ khi reviewAt === null hoặc reviewAt === moves.length
hàng đang sáng    = reviewAt - 1
```

Không sao chép `moves`, không dựng một `GameState` thứ hai, không đụng `core/game`. Lý do
là bất biến 1: một ván có hai nguồn đúng thì sớm muộn hai nguồn lệch nhau, và lệch **âm
thầm** — bàn vẫn vẽ, danh sách vẫn chạy, chỉ là chúng nói hai chuyện khác nhau.

Hệ quả kéo theo, đều miễn phí:

- **Xem lại không thể làm hỏng ván**, vì không có gì để hỏng — không có nhánh, đúng yêu
  cầu "chỉ đọc" của US-03.
- **Đánh quân trong lúc xem lại tự động bị chặn**: `useBoardCanvas.onPointerUp` đã bỏ qua
  khi `status.kind !== 'playing'`, và xem lại chỉ mở được sau khi ván kết thúc.
- **Thoát xem lại** là `setReviewAt(null)`. Không phải một phép khôi phục.

## 3. Danh sách nước đi chỉ đọc khi đang chơi

Chốt trong brainstorm: lúc đang chơi, danh sách **không bấm được**; nó chỉ chạy theo ván
và tự cuộn tới nước mới nhất. Xem lại chỉ vào được **từ màn kết ván**.

Lý do không phải là tiết kiệm công. `journeys.md` §US-03 đã chỉ đúng tên lỗi: *"Nhảy tới
một nước rồi bấm hoàn nước — hai chức năng cùng đi trên một danh sách nước đi."* Danh sách
bấm được giữa ván tạo ra trạng thái "đang xem quá khứ trong khi máy vẫn có thể trả nước",
và đó là chỗ sai âm thầm. Cấm nó bằng thiết kế rẻ hơn xử lý nó bằng code.

**Hệ quả có thật, ghi ra để không ai coi là bỏ sót:** người chơi muốn xem lại một ván
**đang dở** thì phải bỏ ván trước. Đây là đánh đổi có ý, không phải thiếu sót.

## 4. Gợi ý (FR-10)

**Luôn dùng mức Khó, bất kể mức đang chơi** — ADR-0016. Gợi ý tồn tại để giúp người chơi;
ở mức Dễ engine cố ý mù (ADR-0005, ADR-0015) nên gợi ý theo mức đang chơi sẽ là một nước
dở, tệ hơn không gợi ý.

**Gợi ý tái dùng cơ chế "quân xem trước" đã có**, không vẽ hình mới trên canvas:

```
bấm Gợi ý → engine.bestMove(moves, 'human', 'hard') → board.setPreview(at)
```

Quân mờ 0.45 hiện lên, và `BoardStage` tự hiện nút "Đánh" — code đó đã có từ mốc 1. Nên
gợi ý vừa là chỉ dẫn vừa là nước bấm-một-cái-là-đánh, trên cả chuột lẫn cảm ứng, mà
không thêm một token canvas nào (`MASTER.md` §9 cấm thêm màu không có trong file đó).

Ràng buộc:

- **Một yêu cầu tại một thời điểm.** Gợi ý dùng chung `requestId` với nước của máy (bất
  biến 7), nên bấm Gợi ý trong lúc máy đang nghĩ là không hợp lệ — nút disabled khi
  `thinking`.
- **Timeout giống nước của máy** (`ENGINE_TIMEOUT_MS`, NFR-REL-01). Hết hạn thì báo và
  không có gợi ý; không treo.
- Mức Khó tốn ~1.2s (NFR-PERF-06), nên nút phải có trạng thái đang-nghĩ.

## 5. Nút "Đánh" phải tránh quân — ADR-0017

`BoardStage` đang đặt nút ở `left + cell + 8`, tức **8px vào trong ô kế bên**. Ô đó có
quân thì nút che mất quân. Trước mốc 5 chuyện này hiếm: chuột không bao giờ tạo preview
(ADR-0007), nên chỉ cảm ứng gặp. Gợi ý làm preview xuất hiện trên **mọi** thiết bị, và tệ
hơn — nó che đúng cái quân mà gợi ý vừa bảo người chơi nhìn.

Sửa: thử bốn cạnh theo thứ tự **phải → trái → dưới → trên**, lấy cạnh đầu tiên vừa không
có quân vừa còn nằm trong khung nhìn. Hàm thuần, nhận `moves` và kích thước khung, trả
một điểm — test được không cần DOM.

## 6. Chiều cao hàng danh sách — ADR-0018

`MASTER.md` §8 cho `.move-row` cao 32px; §10 bắt mọi nút thật ≥ 44px. Hai câu này chưa
bao giờ đụng nhau vì chưa có gì bấm được. Mốc 5 làm hàng bấm được lần đầu.

Chốt: **32px khi hàng chỉ để đọc, 44px khi hàng là nút** (chế độ xem lại). `MASTER.md` §8
được cập nhật kèm ADR-0018 — không sửa lén một con số trong design system.

## 7. Ranh giới module

Không có module mới. Thay đổi nằm gọn trong ba tầng đã có:

| Tầng | Thêm gì |
| --- | --- |
| `game/render/overlay` | `placeConfirmButton(...)` — hàm thuần chọn cạnh trống (§5) |
| `hooks/useGame` | `reviewAt`, `enterReview`, `exitReview`, `gotoMove`, `askHint` |
| `views/Home/mains/MoveList` | component mới, dùng cho cả cột phải và sheet |
| `views/Home/mains/ReviewBar` | nút tua ‹ › và Thoát |

`game/core` **không đổi một dòng** — xem lại là phép chiếu, không phải luật chơi. Đây là
cách kiểm tra nhanh xem thiết kế này có đúng không: nếu một task nào đó cần sửa
`core/game.ts`, thiết kế đã sai ở đâu đó.

## 8. Chuỗi cần chú ý (NFR-I18N-01)

Thêm vào `lib/strings`: `hintAt`, `hintThinking`, `hintFailed`, `review`, `reviewing`,
`exitReview`, `moveListTitle`, `firstMove`, `prevMove`, `nextMove`, `lastMove`.
`hint`, `settings`, `soundOff` đã có sẵn từ mốc 1.

## 9. Không làm trong mốc này

- Xem lại ván **đã kết thúc từ phiên trước** — chỉ ván vừa chơi xong trong phiên này.
  Lưu lịch sử nhiều ván là một khoá lưu trữ mới, tức ADR-0006 và một đợt kiểm dữ liệu
  hỏng nữa. Không nằm trong FR nào.
- Xuất ván ra text/SGF. Không có FR.
- Bàn phím điều khiển danh sách — thuộc FR-15, mốc 6.
