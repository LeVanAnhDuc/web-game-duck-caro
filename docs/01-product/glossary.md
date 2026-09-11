# Thuật ngữ

> **Trả lời:** Khái niệm này gọi là gì trong code, và hiện ra sao trên UI?
> **Trạng thái:** 🟢 đủ — đã đối chiếu với `src/game/core/types.ts` thật ở mốc 1;
> dòng `Bên` và bốn dòng mới đã đổi theo ADR-0024 · ADR-0025 · ADR-0026 · ADR-0027
> **Cập nhật:** 2026-09-11 · commit —
> **Cập nhật khi:** xuất hiện một khái niệm nghiệp vụ mới trong code hoặc UI

<!-- CÁCH ĐIỀN
File này KHOÁ TÊN GỌI. Mục đích: mọi phiên làm việc đặt tên biến / bảng / route
giống nhau, thay vì mỗi lần tự nghĩ ra một tên mới cho cùng một khái niệm.

Chỉ thêm dòng khi khái niệm ĐÃ xuất hiện trong code hoặc UI. Bảng đầy khái niệm
tưởng tượng thì vô dụng.

KHÔNG chứa: giải thích nghiệp vụ dài (-> overview.md).

GHI CHÚ 2026-09-03: mọi dòng dưới đây đã xuất hiện trên UI — mockup v1 đã được duyệt —
và cột "tên trong code" do ADR-0009 khoá TRƯỚC khi có code. Đó là cố ý: khoá tên trước
là đúng việc của file này, vì tên sai trong kiểu dữ liệu lõi sẽ nhân bản ra mọi file
dùng nó. Đã đối chiếu với code thật ở mốc 1 (2026-09-03): `Cell`, `Mark`, `Side`, `Point`,
`Move`, `Board`, `GameState`, `Level`, `Camera` đúng như bảng dưới. `Stone` không xuất
hiện ở đâu trong `src/`.
-->

| Thuật ngữ | Định nghĩa một câu | Tên trong code | Tên trên UI (VI) | Tên trên UI (EN) |
| --- | --- | --- | --- | --- |
| Ô | Một ô vuông của lưới — chỗ đặt quân. **Không** phải giao điểm (ADR-0009) | `Cell` | ô | cell |
| Quân | Dấu `X` hoặc `O` nằm trong một ô | `Mark` | quân | mark |
| Ghế | Một trong hai bên đi của ván. **Không** mang thông tin ai điều khiển nó (ADR-0024) | `Side` (`'one'` · `'two'`) | Người 1 · Người 2 *(hot-seat)* · Bạn · Máy *(đấu máy)* | Player 1 · Player 2 · You · AI |
| Người điều khiển | Ai ngồi ở một ghế: người thật hay engine | `Controller` (`'human'` · `'engine'`) | — *(không hiện trực tiếp)* | — |
| Chế độ chơi | Ánh xạ từ mỗi ghế sang người điều khiển của nó | `Mode` (`Record<Side, Controller>`) | Đấu máy · Hai người | vs AI · Two players |
| Luật thắng | Đoạn năm quân bị chặn cả hai đầu có tính thắng hay không. Chọn khi bắt đầu ván và đông cứng theo ván (ADR-0025) | `Rule` (`'blocked'` · `'free'`) | Caro Việt · Tự do | Vietnamese · Freestyle |
| Bộ quân | Cặp hình dùng để vẽ quân của hai ghế. Thuần trình bày, không đổi kết quả ván (ADR-0027) | `PieceSet` (`'pencil'` · `'solid'` · `'geo'` · `'duck'`) | Bút chì · Đặc/rỗng · Hình học · Vịt | Pencil · Solid · Geometric · Duck |
| Giao diện | Sáng, tối, hay đi theo thiết lập của máy (ADR-0026) | `Theme` (`'light'` · `'dark'` · `'system'`) | Sáng · Tối · Theo máy | Light · Dark · System |
| Toạ độ | Cặp số nguyên định danh một ô, âm được; `(0,0)` là ô nước đầu | `Point` `{x, y}` | *hiện dạng* `3, -2` | *hiện dạng* `3, -2` |
| Nước đi | Một lần đặt quân: ô nào, bên nào | `Move` | nước đi | move |
| Bàn | Chỉ mục thưa từ ô sang quân, dẫn xuất từ `moves` (ADR-0002) | `Board` | bàn | board |
| Ván | Một trận từ nước đầu tới khi thắng, thua, hoặc bỏ ván | `Game` | ván | game |
| Đoạn cực đại | Dãy quân cùng ghế liền nhau dài nhất chứa một ô — căn cứ xét thắng ở **cả hai** luật (ADR-0003 · ADR-0025) | `maximalRun` | — *(không hiện trên UI)* | — |
| Đầu mở | Đầu của một đoạn mà ô ngay ngoài **không** phải quân địch | `openEnds` | — *(không hiện trên UI)* | — |
| Mức khó | Bộ tham số của engine AI: độ sâu, ngân sách, mức nhiễu (ADR-0005) | `Level` (`'easy'` · `'normal'` · `'hard'`) | Dễ · Thường · Khó | Easy · Normal · Hard |
| Khung nhìn | Phần bàn đang thấy: gốc và mức phóng | `Camera` | — | — |
| Về giữa | Khớp khung nhìn vào hộp bao của toàn bộ quân đã đánh | `recenter` | Về giữa | Recenter |
| Gợi ý | Một nước do chính engine AI ở mức Khó đề xuất cho người chơi | `hint` | Gợi ý | Hint |
| Hoàn nước | Trả bàn về trước lượt của ghế đang đi: đấu máy lùi **hai** nước, hot-seat lùi **một** | `undo` | Hoàn nước | Undo |
| Xem lại ván | Đi qua lại các nước của một ván, **chỉ đọc** | `replay` | Xem lại ván | Replay |
| Bỏ ván | Ghế đang đi kết thúc ván và nhận thua | `resign` | Bỏ ván | Resign |
| Quân xem trước | Quân mờ chưa thành nước thật, chỉ có trên cảm ứng (ADR-0007) | `preview` | — *(không có nhãn chữ)* | — |

**Tên bị cấm:**

- Dùng `Cell`, **không** dùng `Intersection` · `Square` · `Tile`.
- Dùng `Mark`, **không** dùng `Stone` · `Piece`. ADR-0002 viết `Stone` trước khi có
  ADR-0009; ADR là append-only nên chữ đó còn nguyên ở đấy, nhưng **code dùng `Mark`**.
- Dùng `Side` cho **cái ghế** và `Controller` cho **ai ngồi đó** — hai khái niệm rời,
  không gộp lại (ADR-0024). **Không** dùng `Player` · `Color`. Không có "màu" nào phân
  biệt hai ghế — HÌNH mới là thứ phân biệt (ADR-0008), và hình còn đổi được (ADR-0027),
  nên cũng **không** đặt tên ghế theo hình: không `'x'` · `'o'`.
- Dùng `'one'` · `'two'` cho giá trị của `Side`, **không** dùng `'first'` · `'second'` —
  `createGame(first: Side)` sẽ đọc thành `first === 'second'`.
- Dùng `Rule`, **không** dùng `Variant` · `RuleSet`. Dùng `PieceSet`, **không** dùng
  `Skin` · `MarkStyle` · `Theme` — `Theme` đã là tên của sáng/tối.
- Dùng `Level`, **không** dùng `Difficulty`.
- Dùng `Point` chỉ cho toạ độ ô, **không** dùng `Coord` · `Pos`.
- Dùng "ô", **không** dùng "giao điểm" trong mọi văn bản mới (ADR-0009).
