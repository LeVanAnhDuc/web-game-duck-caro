# ADR-0023 · Nhận quy ước tầng view của `quapp-developer-frontend`, bác phần thuộc về tầng dữ liệu

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** ADR-0006 · ADR-0018 · ADR-0019 · ADR-0021 · bất biến 13

## 1. Bối cảnh

Dự án này tự đặt quy ước khi cần, không theo một bộ nào có sẵn. Hệ quả đọc được ngay
trong code: `views/Home/index.tsx` phình tới **379 dòng**, trong đó **8 `useEffect`**
đồng bộ — nạp mức khó mặc định, tiếp tục ván dở, lưu sau mỗi nước, ghi thống kê, phát
tiếng, đẩy gợi ý — mỗi cái kèm một `useRef` làm khoá chống chạy lại và một
`eslint-disable` riêng. Phần bố cục thật sự của màn hình nằm lẫn giữa đám đó.

`views/Home/mains/` cũng trộn hai loại khác hẳn nhau: khối lớn dựng một lần
(`BoardStage`, `StartOverlay`) và mảnh dựng hai lần ở hai khổ màn — bốn trong số đó đã
phải mang prop `variant: 'panel' | 'sheet'` để tự phân biệt, tức là code đã tự khai ra
sự khác biệt mà cây thư mục không ghi.

`quapp-developer-frontend` (Next.js 14 Pages Router, MUI + Tailwind, dữ liệu từ CMS) là
một dự án anh em trong cùng workspace, có một bộ quy ước đã chạy thật trên ~150 file.
Câu hỏi không phải "quy ước đó có tốt không" mà "phần nào của nó đúng cho một app **có
tầng nghiệp vụ**, khác với một web **hiển thị JSON từ CMS**".

## 2. Quyết định

Nguồn đúng là [`docs/03-design/code-conventions.md`](../03-design/code-conventions.md):
22 rule mã `R-01`…`R-22`, mỗi rule ghi rõ nhận / sửa / bác kèm lý do. ADR này chỉ ghi
lại quyết định và ranh giới của nó.

**Nhận** — những rule về cách tổ chức một view:

| Rule | Nội dung |
| --- | --- |
| R-03 | Tách `views/<X>/mains/` (khối lớn, dựng một lần) khỏi `views/<X>/components/` (mảnh dựng lại) |
| R-04 | `views/<X>/ghosts/` — component `return null` chỉ chạy side-effect |
| R-11 | Import chia khối có nhãn: `libs · types · game · hooks · components · ghosts · others` |
| R-12 | `import type` cho mọi import chỉ dùng ở vị trí type, ép bằng ESLint |
| R-16 | Props viết inline trong signature, không tách `type` riêng |
| R-18 | Barrel `hooks/index.ts` |
| R-21 | Bốn luật style của ESLint + `@typescript-eslint` thành devDependency tường minh |
| R-22 | `.githooks/pre-commit` lint file staged |

**Bác** — những rule phục vụ một tầng dữ liệu mà dự án này không có:

| Rule | Vì sao bác |
| --- | --- |
| R-08 `export default` | Đang 143 named export / 2 default. Named export cho `grep`, auto-import và rename an toàn |
| R-10 `{...{ x }}` | `grep "moves="` không còn tìm ra chỗ truyền prop, trong một dự án lấy `grep` làm cơ chế truy vết |
| R-14 `src/types/` | Type ở đây thuộc về module sinh ra nó; kéo lên thư mục riêng là cắt nó khỏi module và làm `no-restricted-imports` mất ý nghĩa |
| R-15 tiền tố `I`/`T` | TypeScript không phân biệt nơi dùng, nên tiền tố không mang thêm thông tin |
| R-20 Prettier | Đổi 3 tuỳ chọn = format lại toàn bộ `src/`, `git blame` mất dấu, đổi lại không được gì |

Một chỗ **lệch khỏi ví dụ trong file rule**: `Controls` được xếp vào `components/` chứ
không phải `mains/`. Ví dụ trong file liệt kê nó là khối dựng một lần, nhưng code thì
dựng nó **hai** lần (`orientation="row"` cho mobile, `"column"` cho desktop). Tiêu chí
của R-03 là số lần dựng, nên tiêu chí thắng ví dụ.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Bê nguyên cả 22 rule của quapp | Năm rule trong đó phục vụ tầng dữ liệu CMS. `src/types/` và context-thay-props sẽ phá đúng tầng nghiệp vụ mà quapp không có: state ở đây **sống** (`game.state` đổi mỗi nước), đưa vào context là mọi consumer re-render mỗi nước, kể cả `StatsPanel` không liên quan |
| Không nhận gì, tự đặt quy ước tiếp | Giữ nguyên `index.tsx` 379 dòng. Và bộ quy ước tự đặt thì không ai kiểm được là đã đủ hay chưa, vì không có bản đối chiếu nào |
| Chỉ thêm luật ESLint, không đụng cấu trúc | ESLint không bắt được "file này làm quá nhiều việc". Đúng cái tốn kém nhất của `index.tsx` là thứ không luật lint nào thấy |
| Gom side-effect vào một hook `useHomeEffects` | Gom 8 effect vào một hook chỉ đổi chỗ đống rối, và còn giấu nó sau một cái tên không nói gì. Ghost thì mỗi cái một tên, một trách nhiệm, và nhìn thấy được trong cây JSX |

## 4. Hệ quả

**Được:**
- `views/Home/index.tsx` từ **379 xuống 275 dòng**, và quan trọng hơn số dòng: còn
  **1 `useEffect`** (đóng worker) thay vì 8, **0 `useRef`** khoá thay vì 4, **0**
  `eslint-disable` thay vì 6. Sáu ghost mang tên đúng việc chúng làm.
- Khối JSX của chế độ xem lại từng bị viết **hai lần** — một bản sheet, một bản panel —
  nay là một `ReviewPane` có `variant`, nên sửa một bên không còn quên bên kia.
- `PlayMoveSound` sở hữu luôn đối tượng âm thanh, nên `index.tsx` không còn biết gì về
  `AudioContext` (ADR-0021).
- Cây thư mục nói ra được điều mà trước đây chỉ prop `variant` biết.

**Mất / phải chấp nhận:**
- Ghost đẩy state qua props, nên mỗi ghost thêm 3-5 dòng nối dây trong `index.tsx`.
  Đây là giá phải trả để không dùng context — và là giá rẻ hơn.
- **Thứ tự ghost trong JSX = thứ tự chạy effect.** Đây là một cách sai âm thầm mới:
  effect của con chạy trước effect của cha và theo đúng thứ tự con, nên xê dịch mấy
  dòng ghost là đổi thứ tự lưu ván / ghi thống kê / phát tiếng, mà test vẫn xanh. Đã
  ghi thành **bất biến 13**.
- Ghost phải render **vô điều kiện**. Gắn nó sau một `&&` là dựng lại đối tượng nó sở
  hữu mỗi lần điều kiện đổi. Cũng nằm trong bất biến 13.
- Import chia khối có nhãn là quy ước **thủ công** — không script nào ép được, nên nó
  sẽ trôi trước mọi rule khác.

**Điều kiện xem lại quyết định này:** nếu số ghost vượt quá mức đọc được trong một màn
hình (khoảng 8-10), thì vấn đề không còn là chỗ đặt effect mà là `Home` đang giữ quá
nhiều trách nhiệm — lúc đó tách view chứ không tách thêm ghost.
