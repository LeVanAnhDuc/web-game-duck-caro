# DEPLOY — Bản xuất tĩnh và base path

Truy vết phía app: ADR-0001 · ADR-0010 · ADR-0011 · ADR-0012 · ADR-0022 · CLAUDE.md §Deploy.

- **REQ-DEPLOY-01** Trang mở từ bản xuất tĩnh với tiêu đề "Duck Caro", tiếng Việt (`lang="vi"`), và không tài nguyên nào lỗi: mọi response dưới 400, không request nào thất bại — kể cả khi chơi (chunk của Worker tải muộn).
- **REQ-DEPLOY-02** Mọi request của trang nằm dưới base path của site: gốc `/` khi chạy tại chỗ, `/web-game-duck-caro/` trên GitHub Pages.
