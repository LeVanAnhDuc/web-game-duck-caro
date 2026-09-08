# Kế hoạch · Lịch sử nước đi, xem lại ván, gợi ý

> **Cho người thực thi:** dùng `superpowers:executing-plans`. Mỗi bước có checkbox — khi
> ngữ cảnh bị nén giữa chừng, checkbox là thứ duy nhất nói được "đang ở task 7 / 9".

**Mục tiêu:** FR-08 · FR-09 · FR-10 lên được, không sửa một dòng nào trong `game/core`.

**Cách làm:** xem lại là một PHÉP CHIẾU trên `state.moves` (`design.md` §2), không phải
một trạng thái song song. Gợi ý tái dùng cơ chế quân xem trước đã có.

**Spec:** [`design.md`](design.md)

## Ràng buộc toàn cục

- `game/core` **không đổi**. Task nào cần sửa `core/game.ts` là dấu hiệu thiết kế sai.
- Chuỗi hiển thị chỉ nằm trong `src/lib/strings.ts` (NFR-I18N-01).
- Không hex mới; màu lấy từ biến CSS đã có (`MASTER.md` §9).
- Test viết bằng `describe`/`it` tiếng Việt, `.ts` không JSX, hook test dùng
  `mountHook` kiểu `useGame.test.ts`.
- Lệnh: `yarn test` · `yarn typecheck` · `yarn lint` · `yarn build`.

---

### Task 1 · `placeConfirmButton` — nút xác nhận tránh quân (ADR-0017)

**Files:** sửa `src/game/render/layers/overlay.ts` · test `src/game/render/layers/overlay.test.ts`

**Produces:**
```ts
export type ConfirmSpot = { readonly x: number; readonly y: number };
export function placeConfirmButton(
  cam: Camera, at: Point, moves: readonly Move[],
  view: { w: number; h: number }, btn: { w: number; h: number },
): ConfirmSpot
```

- [ ] **B1.** Viết test trước, trong `overlay.test.ts`:
  - ô phải trống → nút ở `left + cell + 8`
  - ô phải có quân → nút sang trái, `left - 8 - btn.w`
  - phải và trái đều có quân → nút xuống dưới, `top + cell + 8`
  - ba cạnh kín → nút lên trên
  - cạnh phải trống nhưng tràn khung nhìn → bỏ qua, sang trái
  - bốn cạnh đều không dùng được → về mặc định bên phải (không ném)
- [ ] **B2.** Chạy `yarn test src/game/render/layers/overlay.test.ts` → FAIL, chưa có hàm.
- [ ] **B3.** Hiện thực. Dùng `cellToScreen` cho mọi phép đổi toạ độ (bất biến 11);
      tra quân bằng `Set` của `` `${x},${y}` `` dựng từ `moves`.
- [ ] **B4.** Chạy lại → PASS.
- [ ] **B5.** Commit: `feat(render): confirm button picks a free side (ADR-0017)`

---

### Task 2 · `BoardStage` dùng hàm mới

**Files:** sửa `src/views/Home/mains/BoardStage/index.tsx`

**Consumes:** `placeConfirmButton` (Task 1).

- [ ] **B1.** Bỏ phép tính `previewCorner.x + board.cam.cell + 8` inline; gọi
      `placeConfirmButton`. Kích thước khung lấy từ `canvasRef.current` (clientWidth/Height),
      `btn` là hằng số `{ w: 72, h: 44 }` khớp `min-h-11` + padding.
- [ ] **B2.** `yarn typecheck` → sạch.
- [ ] **B3.** Commit: `refactor(views): board stage places the confirm button by rule`

---

### Task 3 · Chuỗi mới

**Files:** sửa `src/lib/strings.ts`

**Produces:** `hintAt(x,y)` · `hintThinking` · `hintFailed` · `review` · `reviewing` ·
`exitReview` · `moveListTitle` · `firstMove` · `prevMove` · `nextMove` · `lastMove` ·
`reviewPosition(n, total)`

- [ ] **B1.** Thêm, giữ nguyên phong cách hiện có (hàm cho chuỗi có tham số).
      Tiếng Việt. `reviewPosition` trả `${n} / ${total}`.
- [ ] **B2.** `yarn typecheck` → sạch. Commit: `feat(strings): strings for move list, review and hint`

---

### Task 4 · `useGame`: gợi ý (FR-10 · ADR-0016)

**Files:** sửa `src/hooks/useGame.ts` · test `src/hooks/useGame.test.ts`

**Produces:** thêm vào `UseGame`:
```ts
readonly hinting: boolean;
askHint(): void;
```

- [ ] **B1.** Test trước:
  - `askHint()` gọi `engine.bestMove` với `level === 'hard'` **kể cả khi đang chơi mức Dễ**
  - gợi ý KHÔNG thêm nước nào vào `state.moves`
  - kết quả về thì `notice` là `strings.hintAt(x, y)`
  - engine ném / quá hạn → `notice` là `strings.hintFailed`, `hinting` về `false`
  - `askHint()` khi `toMove !== 'human'` hoặc ván đã kết thúc → không gọi engine
  - hoàn nước trong lúc đang xin gợi ý → kết quả gợi ý bị BỎ (bất biến 7)
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Dùng chung `requestId` với `askEngine`; cùng `ENGINE_TIMEOUT_MS`.
      Gợi ý trả điểm ra ngoài qua một state `hint: Point | null` để `Home` đẩy vào
      `board.setPreview` — `useGame` không được biết gì về canvas.
- [ ] **B4.** Chạy → PASS. Commit: `feat(hooks): hint asks the hard engine (ADR-0016)`

---

### Task 5 · `useGame`: xem lại (FR-09)

**Files:** sửa `src/hooks/useGame.ts` · test `src/hooks/useGame.test.ts`

**Produces:**
```ts
readonly reviewAt: number | null;   // null = không xem lại
enterReview(): void;                // đứng ở nước cuối
exitReview(): void;
gotoMove(n: number): void;          // 0..moves.length, tự kẹp biên
```

- [ ] **B1.** Test trước:
  - `enterReview()` khi ván chưa kết thúc → không vào (`reviewAt` vẫn `null`)
  - `enterReview()` sau khi thắng → `reviewAt === moves.length`
  - `gotoMove(-5)` → 0 · `gotoMove(999)` → `moves.length`
  - `exitReview()` → `null`
  - **`state.moves` không đổi trong suốt mọi thao tác xem lại** (đây là bài test giữ
    bất biến 1; nó là bài quan trọng nhất của task này)
  - `restart` và `resetToMenu` đặt `reviewAt` về `null`
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. `reviewAt` là `useState<number | null>`. Không đụng `setState`
      của `state`.
- [ ] **B4.** Chạy → PASS. Commit: `feat(hooks): review is a projection over moves`

---

### Task 6 · `MoveList`

**Files:** tạo `src/views/Home/mains/MoveList/index.tsx` · test cùng thư mục `index.test.tsx`

**Props:**
```ts
{ moves: readonly Move[]; currentAt: number | null;
  variant: 'panel' | 'sheet'; onPick?: (n: number) => void }
```
`onPick === undefined` nghĩa là chỉ đọc → hàng cao 32px, không `cursor-pointer`,
không `aria-current`. Có `onPick` → hàng cao 44px, `aria-current="true"` ở hàng
`currentAt`, nước sau `currentAt` làm mờ (ADR-0018).

- [ ] **B1.** Test trước (render bằng `createRoot`, không JSX runtime mới):
  - chỉ đọc: không có `button` nào trong cây
  - bấm được: đúng `moves.length` nút, bấm nút thứ 3 gọi `onPick(3)`
  - `aria-current="true"` đúng một phần tử
  - toạ độ âm hiện dấu `−` (U+2212) chứ không phải `-`
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Grid `2.5rem 1.25rem 1fr` (MASTER §8), `font-mono`, glyph X/O là
      SVG như `StatusLine`. Tự cuộn tới hàng cuối bằng `useEffect` + `scrollIntoView`
      khi chỉ đọc; tới `currentAt` khi đang xem lại.
- [ ] **B4.** Chạy → PASS. Commit: `feat(views): move list, read-only while playing (FR-08)`

---

### Task 7 · `ReviewBar`

**Files:** tạo `src/views/Home/mains/ReviewBar/index.tsx` · test cùng thư mục

**Props:** `{ at: number; total: number; variant: 'panel' | 'sheet'; onGoto(n): void; onExit(): void }`

- [ ] **B1.** Test trước: ở nước 0 thì `|◀` và `◀` disabled; ở nước cuối thì `▶` và `▶|`
      disabled; bấm `▶` gọi `onGoto(at + 1)`; bấm Thoát gọi `onExit`.
- [ ] **B2.** Chạy → FAIL.
- [ ] **B3.** Hiện thực. Bốn nút icon Lucide (`ChevronsLeft`, `ChevronLeft`,
      `ChevronRight`, `ChevronsRight`) đều ≥44px, mỗi nút có `aria-label` từ `strings`.
- [ ] **B4.** Chạy → PASS. Commit: `feat(views): review scrubber bar (FR-09)`

---

### Task 8 · Ghép vào `Home`

**Files:** sửa `src/views/Home/index.tsx` · `mains/WinSheet/index.tsx` · `mains/Controls/index.tsx`

- [ ] **B1.** `Controls`: bỏ `disabled` cứng của nút Gợi ý; thêm props `canHint`, `onHint`.
- [ ] **B2.** `WinSheet`: thêm props `onReview`, hiện nút "Xem lại" cạnh "Chơi lại".
- [ ] **B3.** `Home`:
  - `board` nhận `moves={game.reviewAt === null ? game.state.moves : game.state.moves.slice(0, game.reviewAt)}`
  - `status` truyền vào board là `{ kind: 'playing' }` khi đang xem lại **và**
    `reviewAt < moves.length` — để nét gạch thắng chỉ hiện ở nước cuối (`design.md` §2)
  - `useEffect` đẩy `game.hint` vào `board.setPreview` rồi dọn
  - cột phải: `MoveList` lấp chỗ `min-h-0 flex-1`; khi `reviewAt !== null` thì thay
    `StatusLine`/`StatsPanel`/`WinSheet`/`Controls` bằng `MoveList` bấm được + `ReviewBar`
  - mobile: khi `reviewAt !== null` hiện sheet neo đáy chứa `MoveList` + `ReviewBar`
- [ ] **B4.** `useBoardCanvas`: thêm `setPreview` vào giao diện trả về (hiện chỉ có
      `clearPreview`).
- [ ] **B5.** `yarn typecheck && yarn lint && yarn test` → tất cả xanh.
- [ ] **B6.** Commit: `feat(views): wire move list, review mode and hint into the screen`

---

### Task 9 · Tài liệu, và các con số

**Files:** `README.md` · `CLAUDE.md` · `docs/design-system/gomoku/MASTER.md` ·
`docs/02-requirements/scope.md` · `docs/decisions/README.md` · `docs/04-state/backlog.md`

- [ ] **B1.** `MASTER.md` §8: `.move-row` ghi cả hai chiều cao, dẫn ADR-0018.
- [ ] **B2.** `scope.md`: FR-08 · FR-09 · FR-10 → `xong`.
- [ ] **B3.** `decisions/README.md`: thêm ba dòng ADR-0016/0017/0018 vào bảng.
- [ ] **B4.** `README.md` §Features: ba bullet tiếng Anh. Cập nhật số test trong Tech Stack
      bằng **con số vừa chạy ra**, và dòng milestone "1 to 5 of 7".
- [ ] **B5.** `CLAUDE.md`: sửa `yarn test # vitest, 89 tests` thành số thật.
- [ ] **B6.** `backlog.md` §Đang làm: viết lại cho mốc 5.
- [ ] **B7.** Commit: `docs: milestone 5 — move list, review, hint`

---

## Tự rà trước khi bắt đầu

- Mọi mục của `design.md` đều có task: §2 → Task 5+8 · §3 → Task 6 · §4 → Task 4 ·
  §5 → Task 1+2 · §6 → Task 6+9 · §7 → Task 1,4,5,6,7 · §8 → Task 3.
- Không có "TBD" nào.
- Tên hàm dùng ở Task 8 (`setPreview`, `askHint`, `enterReview`, `gotoMove`) đều được
  định nghĩa ở Task 4, 5, 8-B4.
