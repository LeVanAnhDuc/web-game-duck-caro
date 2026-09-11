# Quy ước code (rút từ `quapp-developer-frontend`)

> **Trả lời:** Code mới đặt ở thư mục nào, đặt tên ra sao, viết theo khuôn nào?
> **Trạng thái:** 🟢 đủ — đã chốt và đã áp dụng vào `src/` (ADR-0023)
> **Cập nhật:** 2026-09-11 · commit —
> **Cập nhật khi:** chốt/bác một rule · thêm một tầng thư mục mới · đổi cấu hình Prettier/ESLint

<!-- CÁCH ĐIỀN
File này trả lời "viết code thế nào", KHÔNG trả lời "hệ thống ghép ra sao"
(-> architecture.md) hay "sửa gì thì sai âm thầm" (-> invariants.md).

Mỗi rule có một mã R-xx để commit và review tham chiếu tới. Mã không tái dùng.
Cột "Áp dụng" là thứ cần quyết trước khi file này chuyển sang 🟢.

KHÔNG chứa: lý do chọn framework (-> decisions/), ngưỡng đo được (-> nfr.md).
-->

## 0. Nguồn và cách đọc

Toàn bộ rule dưới đây **rút từ dự án `quapp-developer-frontend`** (Next.js 14 Pages
Router, MUI + Tailwind, dữ liệu từ CMS). Đây là bản chép lại quy ước có thật trong code
đó, không phải bản lý tưởng hoá.

Mỗi rule có ba phần: **quy tắc** · **ví dụ từ quapp** · **Áp dụng?** — trạng thái đề
xuất cho `web-game-duck-caro`:

| Ký hiệu | Nghĩa                                                              |
| ------- | ------------------------------------------------------------------ |
| ✅ nhận | bê nguyên, dự án này đang thiếu hoặc đang làm lệch                 |
| 🟡 sửa  | ý đúng nhưng phải đổi chi tiết cho hợp App Router / tầng nghiệp vụ |
| ❌ bỏ   | chỉ đúng với dự án CMS-driven, bê sang sẽ hại                      |

Dòng cuối mỗi mục ghi **chi phí** nếu nhận: số file phải đổi.

Các dấu ✅ / 🟡 / ❌ dưới đây đã được **thi hành**, không còn là đề xuất — ADR-0023
ghi lại quyết định và những gì bị bác.

---

## 1. Cây thư mục

### R-01 — Mỗi vai trò một thư mục cấp 1 dưới `src/`

```
src/
  pages/        routing — mỏng, không logic
  views/        màn hình, một thư mục một trang
  components/   component dùng chung XUYÊN trang
  layouts/      khung bao quanh mọi trang
  contexts/     React context + provider
  hooks/        custom hook, có barrel index.ts
  types/        khai báo type, một file một trang
  constants/    enum hằng số
  utils/        hàm thuần, không React
  requests/     tầng gọi API
  forms/        schema validate (zod)
  styles/       CSS toàn cục
  assets/       ảnh tĩnh import vào code
```

**Áp dụng?** 🟡 sửa. Dự án này không có `requests/` `forms/` `contexts/` `layouts/`
`assets/` (không backend, không form, một màn hình). Nhưng nó có thứ quapp không có:
`src/game/` — tầng nghiệp vụ TS thuần. Cây đề xuất:

```
src/
  app/          routing App Router — mỏng, không logic          (đang đúng)
  views/        màn hình                                        (đang đúng)
  components/   component dùng chung xuyên view                 (CHƯA CÓ)
  game/         nghiệp vụ: core · ai · render · storage · audio · settings
  hooks/        cầu nối React <-> game                          (đang đúng)
  lib/          hàm thuần + chuỗi UI                            (thay utils/ + constants/)
```

Không tạo `src/types/` — xem R-14.

_Chi phí: 0 file đổi, chỉ là thêm thư mục khi cần._

### R-02 — `pages/` chỉ nối dây, không chứa UI

Một file page = lấy data + gọi đúng một view. Trung bình 15 dòng.

```tsx
const HomePage = (pageProps: IHomePage) => <Home />;

export default HomePage;
```

**Áp dụng?** ✅ nhận — và đang đúng sẵn. `src/app/page.tsx` hiện là 5 dòng gọi `<Home />`.

_Chi phí: 0._

### R-03 — Ba tầng trong một view: `index` · `mains` · `components`

```
views/Home/
  index.tsx                       ghép các mains lại, KHÔNG có JSX chi tiết
  mains/Banner/index.tsx          khối lớn của trang, dùng ĐÚNG MỘT LẦN
  components/ShowcaseItem/...     mảnh nhỏ, dùng LẠI trong nội bộ view
```

`index.tsx` của view là một danh sách phẳng, đọc xong biết trang gồm những gì:

```tsx
const Home = () => (
  <div className="space-y-10">
    <Banner />
    <QAppCanDo />
    <Provider />
    <GetStarted />
    <Showcases />
  </div>
);
```

**Áp dụng?** ✅ nhận. Đây là rule đáng giá nhất. Hiện `views/Home/mains/` trộn lẫn hai
loại: `BoardStage` `Header` `Controls` `StartOverlay` `SettingsSheet` là khối lớn dùng
một lần (đúng `mains/`), còn `StatusLine` `MoveList` `ReviewBar` `WinSheet` mang hẳn
prop `variant: 'panel' | 'sheet'` vì được dựng hai lần, và `CursorLive` cũng dựng hai
lần — năm cái đó đúng nghĩa `components/`.

_Đã làm: 6 thư mục chuyển sang `components/` — kể cả `Controls`, thứ mà đoạn trên
liệt kê nhầm là dựng một lần. Code dựng nó HAI lần (`orientation` row/column), và tiêu
chí của rule thắng ví dụ của rule (ADR-0023 §2)._

### R-04 — `ghosts/`: component `return null` chỉ chạy side-effect

Khi một `useEffect` không vẽ gì, nó ra khỏi component cha thành một "ghost".

```tsx
const FetchArticles = ({ pageNumber, setPageNumber }: {...}) => {
  const { doFetchArticles } = useFetchArticles(articles);

  useUpdateEffect(() => { doFetchArticles({ start: ... }); }, [pageNumber]);
  useEffect(() => { setPageNumber(1); }, [locale]);

  return null;
};
```

**Áp dụng?** ✅ nhận — đây là rule chữa đúng bệnh nặng nhất của `src/`.
`views/Home/index.tsx` đang **379 dòng** với 8 `useEffect` đồng bộ: bật/tắt tiếng, dọn
worker, nạp mức khó mặc định, đẩy gợi ý vào preview, tiếp tục ván dở, lưu sau mỗi nước,
ghi thống kê, phát tiếng. Mỗi cái kèm một `useRef` làm khoá chống chạy lại và một
`eslint-disable`.

Tách thành `views/Home/ghosts/{ApplyDefaultLevel,ResumeSavedGame,SaveGame,RecordResult,PlayMoveSound}/`
thì mỗi ghost tự giữ `useRef` khoá của nó, và `index.tsx` còn lại đúng phần bố cục.

⚠️ Ràng buộc: ghost **không được** phá bất biến nào trong `invariants.md` — nhất là
khoá chống đếm trùng thống kê (`recordedFor`) và khoá chống phát lại tiếng
(`soundedFor`). Khoá phải đi cùng effect vào trong ghost, không tách rời.

_Đã làm: 6 ghost + 1 `ReviewPane` gộp JSX trùng. `index.tsx` 379 → 275 dòng;
8 `useEffect` → 1, 4 `useRef` khoá → 0, 6 `eslint-disable` → 0._

---

## 2. File và đặt tên

### R-05 — Một component = một thư mục + một `index.tsx`

Không có `Banner.tsx` nằm trơ. Luôn là `Banner/index.tsx`, để sau này thêm
`Banner/types.ts` hay `Banner/helpers.ts` mà không phải di chuyển gì.

**Áp dụng?** ✅ nhận — đang đúng sẵn 100%.

_Chi phí: 0._

### R-06 — Thư mục component: `PascalCase`. File `.ts` thường: `camelCase`

`views/AboutUs/mains/CeoMessage/index.tsx` · `hooks/useFetchArticles.ts` ·
`types/contact-thank.ts`.

**Áp dụng?** 🟡 sửa. Nhận `PascalCase` cho thư mục component và `camelCase` cho file
`.ts` (đang đúng: `localGameRepository.ts`, `useBoardCanvas.ts`). **Bỏ** `kebab-case`
của `types/` — dự án này không có `types/`.

_Chi phí: 0._

### R-07 — File test nằm cạnh source, tên `<source>.test.ts`

**Áp dụng?** ✅ giữ nguyên cái đang có. quapp **không có test nào** nên không có rule để
mượn — đây là chỗ duck-caro đi trước, đừng đánh mất khi refactor theo R-03/R-04. Chuyển
file thì chuyển cả test đi kèm, trong cùng một commit.

_Chi phí: 0._

---

## 3. Khuôn component

### R-08 — Arrow function + `export default`, implicit return khi không có logic

```tsx
const ShowcaseItem = ({ name, description, image }: IShowcaseItem) => (
  <CustomLink ...>...</CustomLink>
);

export default ShowcaseItem;
```

ESLint ép bằng `"arrow-body-style": ["error", "as-needed"]` — có `{ return ... }` mà
không cần là lỗi.

**Áp dụng?** ❌ bỏ phần `export default`. Dự án này đang 143 named export / 2 default
(2 cái đó do Next bắt buộc). Named export cho `grep`, cho auto-import, và cho rename an
toàn; đổi 143 chỗ để mất ba thứ đó là lỗ.

🟡 Phần `arrow-body-style` thì **nhận được** — nhưng chỉ cho component thuần hiển thị.
Thêm luật vào `.eslintrc.json`, không sửa tay.

_Chi phí: `arrow-body-style` — 1 dòng config, ~5 component sửa theo._

### R-09 — Props nhận bằng destructure ngay ở signature

**Áp dụng?** ✅ nhận — đang đúng sẵn.

_Chi phí: 0._

### R-10 — Idiom `{...{ banner }}` khi tên prop trùng tên biến

```tsx
<BannerBackground {...{ banner }} /> // thay cho banner={banner}
```

**Áp dụng?** ❌ bỏ. Nó tiết kiệm 8 ký tự và đổi lại: không nhảy được tới định nghĩa
prop, và `grep "moves="` không tìm ra chỗ truyền. Trong một dự án lấy `grep` làm cơ chế
truy vết (xem `docs/README.md` §Quy ước ID), mất khả năng grep là mất nhiều hơn được.

_Chi phí: 0 (không làm gì)._

---

## 4. Import

### R-11 — Import chia khối, mỗi khối một comment nhãn, theo thứ tự cố định

```tsx
// libs
import { useEffect } from 'react';
import { useRouter } from 'next/router';
// types
import type { INewsPage } from '@/types/news';
// contexts
import { ProvidePage } from '@/contexts/ProvidePage';
// components
import Home from '@/views/Home';
// hooks
import { useFetchArticles, usePage } from '@/hooks';
// others
import { END_POINTS } from '@/constants';
```

Thứ tự: `libs` → `types` → `contexts` → `components` → `hooks` → `others`.

**Áp dụng?** 🟡 sửa. Ý tốt — mở một file lạ ra là biết ngay nó phụ thuộc vào những tầng
nào. Nhưng nhãn phải theo tầng của **dự án này**, và thứ tự nên phản ánh hướng phụ thuộc
(ngoài vào trong):

```tsx
// libs       react, next, lucide-react
// types      import type từ bất kỳ đâu
// game       @/game/**  <- nghiệp vụ, tầng trong cùng
// hooks      @/hooks/**
// components @/components/**, ./mains/**, ./components/**
// others     @/lib/strings, hằng số cục bộ
```

Comment nhãn là quy ước **thủ công** — không script nào ép được. Nếu thấy phiền thì cân
nhắc `eslint-plugin-import` với `import/order` + `newlines-between` thay cho nhãn chữ.

_Chi phí: ~70 file `.tsx`/`.ts` nếu làm hết. Đề xuất: chỉ áp cho file mới và file đang sửa._

### R-12 — `import type` cho mọi import chỉ dùng ở vị trí type

```tsx
import type { GetStaticProps } from 'next';
import type { IHomePage } from '@/types/home';
```

**Áp dụng?** ✅ nhận. Đang đúng phần lớn (`import type { GameState }`) nhưng không đều —
quapp cũng lệch chỗ này (`views/Home/mains/Banner` viết `import { IHomePage }`). Bật
`@typescript-eslint/consistent-type-imports` để máy canh thay vì mắt người.

_Chi phí: 1 dòng config + `--fix` tự sửa._

### R-13 — Alias `@/` cho mọi import ra ngoài view; đường dẫn tương đối cho trong view

```tsx
import NextImage from '@/components/NextImage'; // xuyên tầng
import BannerContent from '../../components/BannerContent'; // nội bộ view
```

**Áp dụng?** ✅ nhận — đang đúng sẵn. `tsconfig.json` đã có `"@/*": ["./src/*"]`.

_Chi phí: 0._

---

## 5. Type

### R-14 — `src/types/`, một file cho một trang, gom lại ở `common.ts`

**Áp dụng?** ❌ bỏ. quapp cần nó vì mọi type đều là **hình dạng JSON của CMS** — chúng
thuộc về tầng dữ liệu, không thuộc về component nào. Dự án này ngược lại: type thuộc về
module sinh ra nó. `game/core/types.ts` nằm cạnh `board.ts` `rules.ts` là đúng chỗ; kéo
lên `src/types/` sẽ cắt nó khỏi module và làm luật `no-restricted-imports` trong
`.eslintrc.json` mất ý nghĩa.

_Chi phí: 0 (không làm gì)._

### R-15 — Tiền tố `I` cho interface, `T` cho type alias

`IHomePage` · `IImageFormat` · `TPageProps` · `TSetState`. Có 61 chỗ trong quapp.

**Áp dụng?** ❌ bỏ. Quy ước từ thời C#/pre-TS; TypeScript không phân biệt nơi dùng nên
tiền tố không mang thêm thông tin nào. Dự án này đang 0/143 và nhất quán.

_Chi phí: 0 (không làm gì)._

### R-16 — Props phải viết inline

```tsx
const BaseLayout = ({ seo, children }: { seo?: ISeoMetadata; children: React.ReactNode }) => ...
```

_Chi phí: ~6 component._

### R-17 — Hằng số chuỗi gom vào `enum` viết HOA trong `constants/`

```ts
export enum END_POINTS { HOME = "/dev-home", ... }
export enum ROUTES { NEWS = "/news" }
```

**Áp dụng?** 🟡 sửa. Dự án này đã có `lib/strings.ts` làm đúng việc đó cho chuỗi UI.
Không đổi sang `enum` (`enum` sinh object lúc chạy, không tree-shake được, và nhiều mục
ở đây là **hàm** — `strings.reviewPosition(at, total)`). Nhận phần còn lại: hằng số cục
bộ của một component thì viết HOA và để đầu file — đang đúng sẵn (`const NAV = ...`,
`const ENGINE_SEED = 1`, `const LEVEL_LABEL = ...`).

_Chi phí: 0._

---

## 6. Hook và luồng dữ liệu

### R-18 — Barrel `hooks/index.ts`

```ts
import useLayout from './useLayout';
import usePage from './usePage';
export { useLayout, usePage, useFetchArticles, useUpdateEffect };
```

```tsx
import { useFetchArticles, usePage, useUpdateEffect } from '@/hooks';
```

**Áp dụng?** 🟡 sửa. Gọn khi import nhiều hook một lúc — `views/Home/index.tsx` đang có
4 dòng import hook riêng lẻ. Nhưng barrel kéo **cả cụm** vào mọi chỗ import một cái, và
`useBoardCanvas` kéo theo `game/render/*`. Đề xuất: **chỉ làm nếu** sau khi tách ghost
(R-04) vẫn còn file import ≥3 hook. Nếu làm thì `export * from` từng file, không
re-export default.

_Chi phí: 1 file mới, ~8 import đổi._

### R-19 — Hook custom bọc mọi truy cập hạ tầng, component không gọi thẳng

quapp: component không gọi `axios`, chỉ gọi `useFetchArticles`.

**Áp dụng?** ✅ nhận — đang đúng sẵn và chặt hơn: `.eslintrc.json` đã cấm `game/core` và
`game/ai` import React/DOM/render. Giữ nguyên, và khi thêm thư mục mới nhớ khai báo
trong `overrides`.

_Chi phí: 0._

---

## 7. Cấu hình

### R-20 — Prettier

|                               | quapp              | duck-caro |
| ----------------------------- | ------------------ | --------- |
| `singleQuote`                 | `false` (nháy kép) | `true`    |
| `printWidth`                  | 80                 | 96        |
| `trailingComma`               | `"none"`           | `"all"`   |
| `semi`                        | `true`             | `true`    |
| `prettier-plugin-tailwindcss` | có                 | có        |

**Áp dụng?** ❌ bỏ. Đổi 3 tuỳ chọn này = format lại toàn bộ `src/`, một commit chạm mọi
file, `git blame` mất dấu, và không được gì. `trailingComma: "all"` còn cho diff sạch
hơn khi thêm dòng. Giữ nguyên.

_Chi phí: 0 (không làm gì)._

### R-21 — ESLint: luật style bổ sung

quapp bật thêm: `arrow-body-style` · `prefer-const` · `no-var` · `object-shorthand` ·
`quote-props: as-needed` · `@typescript-eslint/array-type` ·
`@typescript-eslint/consistent-type-assertions` (cấm `as` trên object literal) ·
`react/jsx-fragments: syntax` · `react-hooks/exhaustive-deps: warn`.

**Áp dụng?** 🟡 sửa. Đề xuất nhận nhóm rẻ và có ích:

```jsonc
"arrow-body-style": ["error", "as-needed"],
"object-shorthand": "warn",
"@typescript-eslint/array-type": ["warn", { "default": "array" }],
"@typescript-eslint/consistent-type-imports": "error",   // R-12
"react/jsx-fragments": ["warn", "syntax"]
```

Không nhận `exhaustive-deps: "warn"` — dự án này để `error` và dùng `eslint-disable` **có
comment giải thích** ở từng chỗ cố ý. Hạ xuống `warn` là mất lớp canh đó.

⚠️ Vài luật cần `@typescript-eslint/eslint-plugin` + `parser`, hiện **chưa** có trong
`devDependencies`. Nhận nhóm này thì phải thêm 2 gói.

_Chi phí: 5 dòng config + 2 devDependency, `--fix` lo phần lớn._

### R-22 — Husky + lint-staged chặn commit bẩn

quapp: `.husky/` + `.lintstagedrc.json` + `"precommit": "lint-staged"`.

**Áp dụng?** 🟡 sửa. Đã kiểm tra: `.githooks/` ở đây chỉ có `commit-msg` +
`commit-lint.sh`, tức là **chỉ soát commit message**, không chạy ESLint/Prettier trên
file staged. Nên lint-staged vẫn còn chỗ trống thật.

Nhưng **không thêm husky**: `.githooks/` đã là cơ chế hook của dự án (bật bằng
`git config core.hooksPath .githooks`), và husky ghi đè đúng `core.hooksPath` đó — hai
cái cùng lúc thì `commit-msg` im lặng ngừng chạy. Nếu muốn lint trước khi commit thì
thêm một file `.githooks/pre-commit` gọi `yarn lint --fix` trên file staged, giữ nguyên
một cơ chế.

Lưu ý cả hai hook chỉ là phản hồi nhanh, không phải rào chắn — `core.hooksPath` không
theo được `git clone` và `--no-verify` bỏ qua được. Rào chắn thật vẫn là CI.

_Chi phí: 1 file `.githooks/pre-commit`, 0 dependency._
