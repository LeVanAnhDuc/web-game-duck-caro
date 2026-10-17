# Nguồn requirement của Duck Caro

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ tài liệu + quy ước ID (US / FR / NFR / ADR); đọc trước để biết file nào là nguồn đúng
- `../docs/01-product/overview.md` — định vị, Non-Goals (không server, không tài khoản game, không chơi online), giới hạn hot-seat
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-07, kèm "Điều gì có thể sai" (nguồn chính cho case negative)
- `../docs/01-product/glossary.md` — tên khái niệm ↔ tên trong code ↔ tên trên UI (ghế, luật, bộ quân, xem lại…)
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-21 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng NFR-PERF / SEC / A11Y / REL / DATA áp cho mọi feature
- `../docs/03-design/invariants.md` — điều kiện sai âm thầm (luật trên đoạn cực đại, luật đông cứng theo ván, ghế ≠ máy…)
- `../docs/decisions/` — ADR-0001…0029: vì sao hành vi như vậy (vd ADR-0007 tap hai lần trên cảm ứng, ADR-0016 gợi ý dùng mức Khó, ADR-0020 phím, ADR-0026 theme ba trạng thái)
- `../docs/specs/<feature>/design.md` — thiết kế đã duyệt của từng feature (game-core-and-board, real-ai-engine, move-history-and-review, keyboard-sound-settings, e2e-and-lighthouse, v2, ducker-id-sign-in)
- `../docs/design-system/gomoku/MASTER.md` — ngưỡng hiển thị (nút 44px, ô tối thiểu 16px, tương phản, bảng màu sáng/tối)
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi

## Code

- `../client/src/lib/strings.ts` — mọi chuỗi UI (tiếng Việt), nguồn của `src/data/copy.ts`
- `../client/src/views/Home/` — màn hình duy nhất: header, màn bắt đầu, thanh hai ghế, bàn (canvas), cột phải (thông báo, danh sách nước, con trỏ, thống kê, kết ván, nút), cài đặt, xem lại, nút tài khoản
- `../client/src/hooks/` — `useGame` (lượt, máy, hoàn nước, gợi ý, timeout 5s), `useBoardCanvas` (kéo, thu phóng, phím, tap hai lần), `usePersistence`, `useSettings`, đăng nhập
- `../client/src/game/` — luật (`core/rules.ts`), engine AI (`ai/`), camera, bảng màu + bộ quân (`render/`), lưu trữ (`storage/`, khoá `gomoku:v2:*`), cài đặt, âm thanh
- `../client/src/lib/ducker/` — đăng nhập Ducker ID (OIDC + PKCE) sau cờ tính năng
- `../client/src/app/layout.tsx`, `../client/src/game/render/theme.ts` — script đặt theme trước lần vẽ đầu
- `../client/scripts/build-e2e.mjs`, `../client/scripts/serve-out.mjs` — hai bản build (cờ tắt / cờ bật, issuer giả) và server tĩnh mà suite này dùng

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã ship (đọc để biết nợ đã biết, không phải requirement)
- `../docs/03-design/code-conventions.md`, `../docs/03-design/architecture.md` — viết code thế nào / ghép hệ thống ra sao, không nói hành vi
- `../docs/ux-reviews/` — nhật ký phiên persona (phát hiện UX lịch sử)
- `../client/src/**/*.test.ts(x)` — unit/component test của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
