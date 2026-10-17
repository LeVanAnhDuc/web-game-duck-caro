# WINRULE — Quyết định

Đi cặp với `docs/requirements/win-rule.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-03, FR-18), `docs/01-product/journeys.md` (US-01 kết quả mong đợi,
  US-05 bước 2), `docs/03-design/invariants.md` (#3 đoạn cực đại, #14 luật lấy từ ván), `docs/decisions/0003-…`,
  `0025-the-win-rule-is-a-parameter-frozen-per-game.md`, `docs/specs/v2/design.md` §2, `README.md` §"Two win rules,
  chosen per game".
- **Code:** `client/src/game/core/rules.ts`, `client/src/game/core/types.ts` (`DEFAULT_RULE = 'blocked'`),
  `client/src/views/Home/mains/StartOverlay/index.tsx` (dòng giải thích luật), `client/src/views/Home/components/WinSheet`,
  `client/src/views/Home/index.tsx` (`controlProps`, `playAgain`), `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `client/e2e/hotseat-and-theme.spec.ts` "luật Tự do: năm quân bị chặn hai đầu VẪN thắng" →
  TC-WINRULE-007, "luật caro Việt: cùng thế đó KHÔNG thắng" → TC-WINRULE-004, "luật của VÁN sống qua reload" →
  TC-WINRULE-011.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Thế cờ đặt chính xác thế nào? → Chế độ **Hai người** (không có máy chen nước): hai ghế đánh luân phiên đúng
  chuỗi ô định sẵn. Luật áp như nhau cho hai chế độ (`rules.ts` không biết ai cầm ghế).
- **Q2** "Không thắng" chứng minh bằng gì? → Ván vẫn tiếp tục: không có tiêu đề kết ván, đủ số nước, và **nước kế tiếp
  vẫn đánh được**. Chỉ đếm nước thì không phân biệt được "không thắng" với "chưa vẽ xong".
- **Q3** Nét gạch chuỗi thắng trên canvas không kiểm ở e2e (hình vẽ) — tiêu đề + số nước + bàn bị khoá là đủ chứng minh
  ván đã thắng.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Mọi tổ hợp đoạn / khoảng trống / chặn của `rules.ts`: unit test `client/src/game/core/rules.test.ts`.
- Engine hiểu luật Tự do tới bảng mẫu: unit test chiến thuật trong `client/src/game/ai/`.
- Không có hoà (bàn vô hạn) — không có gì để kiểm.

## Tech debt liên quan

_(không có)_
