import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PALETTE_VARS } from '@/game/render/palette';

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

/** Đọc các khai báo `--x: y;` trong khối `{...}` đầu tiên sau `selector`. */
function tokensAfter(selector: string): Record<string, string> {
  const at = css.indexOf(selector);
  expect(at, `khong tim thay selector ${selector}`).toBeGreaterThan(-1);
  const open = css.indexOf('{', at);
  const close = css.indexOf('}', open);
  const body = css.slice(open + 1, close);
  const out: Record<string, string> = {};
  for (const line of body.split('\n')) {
    const m = /^\s*(--[a-z-]+)\s*:\s*([^;]+);/.exec(line);
    if (m?.[1] !== undefined && m[2] !== undefined) out[m[1]] = m[2].trim();
  }
  return out;
}

/**
 * Bảng màu TỐI bị chép HAI LẦN trong `globals.css` — ADR-0026 cần cả hai khối:
 *
 * - `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) }` cho trạng
 *   thái "Theo máy";
 * - `:root[data-theme='dark']` cho lựa chọn tay, và nó phải đứng SAU khối `@media` mới
 *   thắng được ở cả hai chiều.
 *
 * CSS không gộp được hai selector đó vào một khối: một cái nằm trong `@media`, một cái
 * không. Nên bản sao là **bắt buộc**, và nguy cơ là sửa một khối mà quên khối kia —
 * lúc đó "Theo máy" tối và "Tối" chọn tay vẽ ra hai bàn khác nhau, còn `MASTER.md` thì
 * tự nhận là "BẢN SAO DUY NHẤT của palette trong code".
 *
 * Test này biến nguy cơ lệch âm thầm đó thành một test đỏ. Nó không sửa được bản sao,
 * nó chỉ không cho bản sao lệch đi.
 */
describe('globals.css — hai khối màu tối phải GIỐNG HỆT (ADR-0026)', () => {
  const media = tokensAfter(":root:not([data-theme='light'])");
  const manual = tokensAfter(":root[data-theme='dark']");

  it('cùng tập token', () => {
    expect(Object.keys(manual).sort()).toEqual(Object.keys(media).sort());
  });

  it('cùng giá trị cho từng token', () => {
    for (const [name, value] of Object.entries(media)) {
      expect(manual[name], name).toBe(value);
    }
  });

  it('cả hai khối phủ đủ mọi biến canvas đọc (render/palette)', () => {
    // Thiếu một biến thì `readPalette` NÉM — nhưng chỉ ở chế độ tối, tức chỉ ở nửa
    // số người chơi, và chỉ khi họ đã đổi giao diện.
    for (const name of PALETTE_VARS) {
      expect(media[name], `${name} thiếu trong khối @media`).toBeDefined();
      expect(manual[name], `${name} thiếu trong khối data-theme`).toBeDefined();
    }
  });

  it("khối lựa chọn tay đứng SAU khối @media, nếu không nó không thắng được", () => {
    expect(css.indexOf(":root[data-theme='dark']")).toBeGreaterThan(
      css.indexOf(":root:not([data-theme='light'])"),
    );
  });

  it('chọn Sáng bằng tay cũng đặt color-scheme, không chỉ đặt màu', () => {
    // Thiếu dòng này thì thanh cuộn và ô tick của trình duyệt vẫn vẽ theo hệ điều hành
    // và chỏi với cả trang.
    const at = css.indexOf(":root[data-theme='light']");
    expect(at).toBeGreaterThan(-1);
    expect(css.slice(at, css.indexOf('}', at))).toContain('color-scheme: light');
  });
});
