# Kế hoạch · Đăng nhập Ducker ID

**Thiết kế:** [`design.md`](design.md) · **Nhánh:** `feat/ducker-id-sign-in`
Kế hoạch gốc: `web-game/docs/superpowers/plans/2026-10-04-ducker-id-sign-in.md`

- [x] **0** Worktree, cài đặt, baseline (317 unit, 27 e2e xanh)
- [x] **1** Env + base path + `readDuckerConfig` (test trước)
- [x] **2** Lõi auth: PKCE, callback, requests, session (test trước)
- [x] **3** UI: hook, `AccountButton`, chuỗi, gắn vào Header (test trước)
- [x] **3b** Plan amendment 1–4: returnTo khi lỗi, timeout 15s, focus sau đăng xuất,
      chống bấm đúp (+ bfcache), bàn phím menu, kiểm hình dạng userinfo
- [x] **4** E2E cờ bật với issuer giả + E2E cờ tắt
- [x] **5** Tài liệu: Non-Goal, NFR-SEC-07, FR-21, US-07, ADR-0029, README, `.env.example`
- [ ] **6** Gate, push, PR (không merge)
