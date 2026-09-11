# Thiết kế · v2 — hot-seat, luật thắng, giao diện, bộ quân

**Liên quan:** FR-17 · FR-18 · FR-19 · FR-20 · US-05 · US-06 ·
NFR-PERF-06 · NFR-PERF-10 · NFR-A11Y-01 · NFR-A11Y-06 · NFR-A11Y-07 ·
ADR-0024 · ADR-0025 · ADR-0026 · ADR-0027 · ADR-0028

**Vì sao một thư mục cho bốn chức năng.** Chúng chia nhau **một** lần phá cấu trúc lưu
(`STORAGE_VERSION` → `v2`) và **một** mặt UI (màn cài đặt + màn bắt đầu). Tách thành bốn
`design.md` thì phần dùng chung phải chép sang cả bốn, rồi trôi — đúng cái mà docs
contract gọi là "hai file cùng phủ một vùng". `plan.md` cũng phải là một, vì các task
đan vào nhau trong cùng những file.

---

## 0. Cổng phạm vi đã mở, có chủ đích

Hai trong bốn chức năng bị `overview.md` §4 từ chối bằng đúng chữ trước ngày 2026-09-11:
hot-seat, và luật ngoài caro Việt. Cả hai Non-Goal đã được **gỡ** sau một cuộc bàn về
phạm vi, không phải bị bỏ qua. Đổi lại, §4 nhận một Non-Goal mới bó chính chế độ vừa mở:
hot-seat dừng ở hai cái ghế — không tên người chơi, không đồng hồ, không thống kê riêng.

Đây là bước chuyển v1 → **v2**: commit mang `feat!:`, release lên major.

---

## 1. `Side` là ghế, không phải người — cái thay đổi nhiều nhất

Chi tiết và các phương án đã loại: **ADR-0024**.

```ts
type Side = 'one' | 'two';
type Controller = 'human' | 'engine';
type Mode = Readonly<Record<Side, Controller>>;

const VS_AI: Mode   = { one: 'human', two: 'engine' };
const HOTSEAT: Mode = { one: 'human', two: 'human'  };
```

**`game/core` và `game/ai` không đổi một dòng logic.** Chúng chỉ đổi tên giá trị. Đó là
bằng chứng ranh giới của bất biến 4 vẫn đúng: lõi luật vốn không biết ai đang ngồi.

Chỗ đổi thật:

| File | Đổi gì |
| --- | --- |
| `core/types.ts` | `Side`, thêm `Controller` · `Mode` · `Rule`; `opponentOf` giữ nguyên hình dạng |
| `hooks/useGame.ts` | nhận `mode` · `rule`; sau mỗi nước tra `mode[toMove] === 'engine'` mới gọi engine; `undo` lùi 1 hoặc 2 nước theo `mode` |
| `storage/types.ts` | `SavedGame` thêm `mode` · `rule`; `first: Side` đổi miền giá trị |
| `storage/keys.ts` | `STORAGE_VERSION = 'v2'` |
| `views/Home/mains/StartOverlay` | thêm mục Chế độ và mục Luật; ẩn Mức khó khi hot-seat |
| `views/Home/components/StatusLine` | **bị thay** bởi `SeatBar` (ADR-0028) |
| `views/Home/ghosts/PlayMoveSound` | tiếng theo ghế, không theo "người hay máy" |
| `views/Home/ghosts/RecordResult` | **không ghi** thống kê khi `mode` là hot-seat |
| `lib/strings.ts` | tên ghế theo `mode`; bỏ mọi chuỗi giả định đối thủ là máy |

**Bất biến mới 15** canh đúng chỗ dễ sai: không ai được suy ra "đây là máy" từ
`side === 'two'`. Chỉ `mode[side] === 'engine'` trả lời được câu đó.

### Hoàn nước lùi mấy nước

Đấu máy lùi **2** (về lại lượt của người), hot-seat lùi **1** (trả lại đúng nước vừa
đánh). Không phải hai hàm — `undo(state, mode)` đọc `mode` và quyết. Ghi vào glossary vì
đây là chỗ hành vi khác nhau mà tên gọi thì giống.

---

## 2. Luật thắng là tham số, đông cứng theo ván

Chi tiết và các phương án đã loại: **ADR-0025**.

```ts
type Rule = 'blocked' | 'free';
// rules.ts — đổi đúng một dòng:
run.cells.length >= WIN_LENGTH && (rule === 'free' || run.openEnds > 0)
```

Ba điều phải giữ cùng lúc:

1. **Đoạn cực đại vẫn là cách quét duy nhất** (bất biến 3). Luật chỉ quyết `openEnds` có
   được xét hay không. Không có hàm thứ hai, không có cửa sổ 5 ô trượt.
2. **Luật lấy từ ván, không từ cài đặt** (bất biến mới 14). `settingsStore.defaultRule`
   chỉ điền sẵn màn bắt đầu.
3. **Engine phải biết luật, tới tận bảng mẫu.** `rule` đi kèm `moves` trong mỗi thông
   điệp worker (bất biến 6 mở rộng), và xuống `patterns.ts` / `evaluate.ts`. Không dừng
   ở `rules.ts` — đó là phương án rẻ đã bị bác, vì engine sẽ coi một đoạn năm bị chặn là
   vô hại trong khi nó là thua ngay. ADR-0015 đã dạy đúng bài này một lần.

**Giá phải trả, ghi rõ để không ai ngạc nhiên:** `patterns.ts` là chỗ tốn gần như toàn bộ
thời gian search. Thêm một nhánh vào đó là chạm điểm nóng, nên `NFR-PERF-06` phải đo lại
**cho cả hai luật** — con số hiện có chỉ còn nói về `blocked`.

---

## 3. Giao diện ba trạng thái

Chi tiết và các phương án đã loại: **ADR-0026**.

`Theme = 'light' | 'dark' | 'system'`, mặc định `system`, sống trong `settingsStore`
(ADR-0019 — cài đặt của MÁY). Ba tầng CSS, thứ tự là bắt buộc:

```css
:root { /* token sáng — MASTER.md §1 */ }
@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) { /* §2 */ } }
:root[data-theme='dark'] { /* §2 */ }
```

Hai chỗ dễ bỏ sót, cả hai đều **không có test nào tự bắt được**:

- **Nháy màu khi tải.** Static export không có server để đọc lựa chọn, nên một script
  inline trong `<head>` phải đặt `data-theme` trước lần vẽ đầu tiên. Đây là **ngoại lệ
  có tên** của bất biến 5 — nó chạy trước cả React nên không có seam nào để đi qua.
  `NFR-PERF-10` là cái test E2E giữ nó.
- **Canvas không tự biết theme đổi.** `readPalette` đọc CSS var nên đi theo miễn phí,
  nhưng phải có người gọi vẽ lại: một `MutationObserver` trên `data-theme`, cộng một
  listener `prefers-color-scheme` cho trạng thái `system`.

Không có hex mới. `NFR-A11Y-01` không phải kiểm lại.

---

## 4. Bộ quân là cặp hình

Chi tiết và các phương án đã loại: **ADR-0027**.

`PieceSet = 'pencil' | 'solid' | 'geo' | 'duck'`, trong `settingsStore` — **không** trong
`SavedGame`, vì nó không đổi kết quả ván nào. Đây là chỗ nó khác hẳn `Rule` ở mục 2.

`render/layers/marks.ts` chuyển từ `if (side === 'one')` sang một bảng tra:

```ts
const SETS: Record<PieceSet, Record<Side, (ctx, half) => void>> = { … };
```

**Màu không thuộc về bộ quân** (bất biến mới 16). Mọi bộ dùng `--mark-one` / `--mark-two`
đã có số đo. Đó là cửa duy nhất, và nó đóng.

**Điều kiện nhận một bộ** (`NFR-A11Y-07`): hai hình phân biệt được khi **xám hoá** và ở ô
**16px**. Bộ `duck` là bộ mỏng nhất — ba nét ở 28px đã sát ngưỡng. Nó phải qua bước "nhìn
tận mắt" của flow; không qua thì **bỏ**, và bỏ một bộ đã vẽ xong rẻ hơn giữ một bộ không
đọc nổi.

---

## 5. Thanh hai ghế — thứ buổi duyệt mockup thêm vào

Chi tiết và các phương án đã loại: **ADR-0028**.

Bản mockup đầu giữ `StatusLine` cũ và **bị bác**: ở hot-seat, "tới lượt ai" là thông tin
chính của màn hình, không phải một dòng phụ cao 37px.

`SeatBar` cao 56px, chia đôi màn, **dùng chung cho cả hai chế độ**. Ghế đang đi: nền
`--paper`, chữ `--ink-strong` đậm, gạch chân 3px màu quân của ghế đó. Ghế kia mờ 40%.

Thông tin "tới lượt ai" mang bằng **vị trí và độ đậm** trước; màu chỉ là lớp dư — cùng
nguyên tắc ADR-0008 áp cho quân, nên xám hoá ảnh vẫn đọc được.

**Tín hiệu thứ hai, miễn phí:** quân xem trước ở con trỏ mang hình của bên đang đi
(`--preview-opacity` .45). Cơ chế đã có từ ADR-0007. Thanh trên *nói*; cái này *cho thấy*.

Vùng `aria-live` của `NFR-A11Y-06` chuyển vào `SeatBar` — vẫn đúng một chỗ.

---

## 6. Dữ liệu cũ: bỏ, không migrate

`SavedGame` đổi ba thứ (`Move.side`, `first`, thêm `mode` · `rule`), nên
`STORAGE_VERSION` lên `v2` và dữ liệu `v1` **không được đọc tới** — đúng ADR-0006.

Đã cân nhắc viết một hàm đọc tương thích (~15 dòng: `human→one`, `ai→two`,
`mode=VS_AI`, `rule='blocked'`) và **bác**: viết một hàm có thể sai để bảo vệ một tập
người dùng rỗng. `backlog.md` §Nợ kỹ thuật đã ghi sẵn điều kiện phải trả nợ này — là
lần đổi cấu trúc **kế tiếp**, sau khi game có người chơi thật.

Thống kê giữ nguyên `StatsByLevel` ba ô. Hệ quả, ghi vào §Nợ kỹ thuật:

- ván **hot-seat không được ghi** — không có mức khó nào đúng cho nó;
- ván đấu máy ở luật `free` **đổ chung ô** với luật `blocked`.

---

## 7. Thứ tự làm, và vì sao

`plan.md` theo đúng thứ tự này; lý do ở đây:

1. **Kiểu và lõi trước** (`Side`, `Rule`, `rules.ts`) — mọi thứ khác phụ thuộc, và đây là
   chỗ test đơn vị rẻ nhất.
2. **Engine** — vì `NFR-PERF-06` phải đo lại, và biết sớm nếu nhánh luật quá đắt.
3. **Lưu trữ** — `v2` phải xong trước khi UI có gì để lưu.
4. **`useGame`** — nơi `mode` quyết có gọi engine không.
5. **Giao diện và bộ quân** — độc lập với 1–4, làm sau để không chặn đường tới hạn.
6. **UI** — `SeatBar`, `StartOverlay`, `SettingsSheet`.
7. **E2E và đo** — `NFR-PERF-10`, `NFR-PERF-06` hai luật, `NFR-A11Y-07` bốn bộ.

Mục 5 có thể làm song song với 1–4 nếu cần chia việc; các mục khác thì không.
