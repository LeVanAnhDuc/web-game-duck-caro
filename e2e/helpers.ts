import { expect, type Page } from '@playwright/test';

/**
 * Cạnh ô lúc mới mở ở khổ desktop — `CELL_DEFAULT_DESKTOP` trong `render/camera`.
 * Khung nhìn E2E là 1280 nên luôn là bản desktop (ngưỡng mobile là 640).
 */
export const CELL = 32;

/**
 * Toạ độ ô -> điểm bấm trên canvas.
 *
 * Lúc mở, camera đặt ô (0,0) vào GIỮA khung, và không có gì tự dịch camera sau đó —
 * nước của máy không làm bàn trượt. Nên chỉ cần cộng dồn theo cạnh ô.
 *
 * Nếu một mốc sau này thêm "camera tự trượt tới nước của máy", hàm này sẽ sai IM LẶNG:
 * bấm vẫn ra một ô, chỉ là ô khác. Lúc đó phải đọc camera từ trang thay vì tính ở đây.
 */
export async function cellPosition(page: Page, dx: number, dy: number) {
  const box = await page.locator('canvas').boundingBox();
  if (box === null) throw new Error('khong do duoc canvas');
  return { x: box.width / 2 + dx * CELL, y: box.height / 2 + dy * CELL };
}

/** Bấm vào một ô bằng chuột thật. */
export async function playAt(page: Page, dx: number, dy: number) {
  await page.locator('canvas').click({ position: await cellPosition(page, dx, dy) });
}

/**
 * Số nước đang có trong ván, đọc từ DANH SÁCH NƯỚC ĐI ở cột phải.
 *
 * Đếm hàng chứ không đọc chữ "nước N": ở mốc 8, dòng trạng thái cũ bị tách thành
 * `SeatBar` (lượt của ai) và `NoticeLine` (thông báo), và số nước chuyển vào một chip
 * chỉ in số. Danh sách nước đi là cách nói trực tiếp nhất của "ván có bao nhiêu nước",
 * và nó không đổi chỗ theo bố cục — nên nó là mốc neo bền hơn.
 */
export async function moveCount(page: Page): Promise<number> {
  return page.locator('aside li').count();
}

/**
 * Chờ tới khi ván có đúng `n` nước.
 *
 * Chờ trên TRẠNG THÁI, không trên thời gian: mức Khó tốn tới 1.5s (`NFR-PERF-06`) và
 * CI chậm hơn máy dev, nên mọi `waitForTimeout` là một test sẽ đỏ ngẫu nhiên.
 */
export async function expectMoves(page: Page, n: number) {
  await expect(page.locator('aside li')).toHaveCount(n, { timeout: 15_000 });
}

/**
 * Bấm Tab cho tới khi canvas nhận focus, tối đa `limit` lần.
 *
 * Không ghim con số Tab cụ thể: sau khi màn chọn mức biến mất, phần tử đang giữ focus
 * bị xoá khỏi DOM và điểm bắt đầu của chuỗi Tab phụ thuộc trình duyệt. Điều cần chứng
 * minh là canvas **đến được bằng Tab**, không phải nó đứng thứ mấy.
 */
export async function tabToCanvas(page: Page, limit = 12) {
  const canvas = page.locator('canvas');
  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press('Tab');
    if (await canvas.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error(`canvas khong nhan duoc focus sau ${limit} lan Tab`);
}

/** Mở một ván mới. Mức Dễ là mặc định của test: ~8ms một nước thay vì ~1.2s. */
export async function startGame(
  page: Page,
  opts: {
    level?: 'Dễ' | 'Thường' | 'Khó';
    first?: 'Bạn' | 'Máy' | 'Người 1' | 'Người 2';
    mode?: 'Đấu máy' | 'Hai người';
    rule?: 'Caro Việt' | 'Tự do';
  } = {},
) {
  const overlay = page.getByRole('button', { name: 'Bắt đầu ván mới' });
  await expect(overlay).toBeVisible();
  // Chế độ trước tiên: nó làm mục Mức khó xuất hiện hay biến mất.
  if (opts.mode !== undefined) {
    await page.getByRole('button', { name: opts.mode, exact: true }).click();
  }
  if (opts.mode !== 'Hai người') {
    await page.getByRole('button', { name: opts.level ?? 'Dễ', exact: true }).click();
  }
  if (opts.rule !== undefined) {
    await page.getByRole('button', { name: opts.rule, exact: true }).click();
  }
  if (opts.first !== undefined) {
    await page.getByRole('button', { name: opts.first, exact: true }).click();
  }
  await overlay.click();
  await expect(overlay).toBeHidden();
}

/** Các nút trong cột phải — trùng nhãn với thanh dưới của mobile, vốn vẫn ở trong DOM. */
export const panelButton = (page: Page, name: string) =>
  page.locator('aside').getByRole('button', { name, exact: true });
