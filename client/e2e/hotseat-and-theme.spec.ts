import { expect, test } from '@playwright/test';
import { expectMoves, panelButton, playAt, startGame } from './helpers';

/**
 * Ba thứ ở mốc 8 mà unit test không thể chứng minh, cùng lý do ADR-0022 đưa ra cho E2E:
 *
 * 1. **Worker thật KHÔNG được gọi ở hot-seat.** Mọi test `useGame` đều tiêm một engine
 *    giả, nên chưa cái nào chứng minh worker thật im lặng — và một worker thật đánh hộ
 *    ghế thứ hai là bug tệ nhất mà chế độ này có thể có.
 * 2. **`data-theme` được đặt TRƯỚC lần vẽ đầu** (`NFR-PERF-10`). Script chống nháy
 *    chạy ngoài bundler, trong `<head>`; không có test đơn vị nào chạm được nó ở đúng
 *    thời điểm đó.
 * 3. **Luật của ván sống qua một lần tải lại thật**, chứ không bị cài đặt đè lên.
 */

test('hot-seat: hai người đánh luân phiên, engine KHÔNG đánh nước nào (FR-17 · US-05)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người' });

  // Ghế một đánh. Ở chế độ đấu máy, sau nước này bàn sẽ có 2 nước vì máy đáp lại.
  await playAt(page, 0, 0);
  await expectMoves(page, 1);

  /*
   * Chờ thật lâu hơn ngân sách của mọi mức (NFR-PERF-06: mức Khó 1500ms) rồi khẳng
   * định vẫn đúng 1 nước. Không có phần chờ này, test vẫn xanh ngay cả khi engine
   * đang nghĩ và chỉ chưa trả lời kịp.
   */
  await page.waitForTimeout(2500);
  await expectMoves(page, 1);

  await playAt(page, 1, 0);
  await expectMoves(page, 2);
  await page.waitForTimeout(2500);
  await expectMoves(page, 2);

  // Hai nước đó thuộc HAI ghế khác nhau.
  const rows = page.locator('aside ol li');
  await expect(rows).toHaveCount(2);
});

test('hot-seat: hoàn nước lùi MỘT nước, không phải hai (US-05)', async ({ page }) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người' });
  await playAt(page, 0, 0);
  await playAt(page, 1, 0);
  await expectMoves(page, 2);

  await panelButton(page, 'Hoàn').click();
  // Đấu máy lùi hai; hot-seat lùi một. Lùi hai ở đây là xoá nước của người kia.
  await expectMoves(page, 1);
});

test('hot-seat: màn kết ván gọi tên GHẾ, không gọi "Bạn" (US-05 · ADR-0028)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người' });
  // Ghế một ăn năm ở hàng 0; ghế hai đánh xa ra hàng 5 nên không chặn.
  for (let i = 0; i < 4; i += 1) {
    await playAt(page, i, 0);
    await playAt(page, i, 5);
  }
  await playAt(page, 4, 0);

  await expect(page.locator('aside').getByText('Người 1 thắng')).toBeVisible();
});

test('luật Tự do: năm quân bị chặn hai đầu VẪN thắng (FR-18 · ADR-0025)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người', rule: 'Tự do' });

  // Ghế hai chặn trước ô (−1,0); ghế một ăn 0..4; ghế hai chặn nốt ô (5,0).
  await playAt(page, 0, 0);
  await playAt(page, -1, 0);
  await playAt(page, 1, 0);
  await playAt(page, 5, 0);
  await playAt(page, 2, 0);
  await playAt(page, 9, 9);
  await playAt(page, 3, 0);
  await playAt(page, 8, 8);
  await playAt(page, 4, 0);

  // Ở luật caro Việt, đoạn này CHẾT. Ở luật Tự do nó thắng.
  await expect(page.locator('aside').getByText('Người 1 thắng')).toBeVisible();
});

test('luật caro Việt: cùng thế đó KHÔNG thắng (FR-18 · bất biến 3)', async ({ page }) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người', rule: 'Caro Việt' });

  await playAt(page, 0, 0);
  await playAt(page, -1, 0);
  await playAt(page, 1, 0);
  await playAt(page, 5, 0);
  await playAt(page, 2, 0);
  await playAt(page, 9, 9);
  await playAt(page, 3, 0);
  await playAt(page, 8, 8);
  await playAt(page, 4, 0);

  await expectMoves(page, 9);
  await expect(page.locator('aside').getByText(/thắng/)).toHaveCount(0);
});

test('luật của VÁN sống qua reload, không bị cài đặt đè (bất biến 14)', async ({
  page,
}) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người', rule: 'Tự do' });
  await playAt(page, 0, 0);
  await expectMoves(page, 1);

  // Đổi LUẬT MẶC ĐỊNH trong cài đặt sang caro Việt — ván đang chơi không được đổi theo.
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cài đặt' });
  await dialog.getByRole('button', { name: 'Caro Việt', exact: true }).click();
  await page.getByRole('button', { name: 'Đóng' }).click();

  await page.reload();
  await expectMoves(page, 1);

  // Ván tiếp tục ở luật Tự do: đoạn bị chặn hai đầu vẫn phải thắng.
  await playAt(page, -1, 0);
  await playAt(page, 1, 0);
  await playAt(page, 5, 0);
  await playAt(page, 2, 0);
  await playAt(page, 9, 9);
  await playAt(page, 3, 0);
  await playAt(page, 8, 8);
  await playAt(page, 4, 0);
  await expect(page.locator('aside').getByText('Người 1 thắng')).toBeVisible();
});

test('giao diện tối được đặt TRƯỚC lần vẽ đầu — không nháy (NFR-PERF-10 · ADR-0026)', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cài đặt' });
  await dialog.getByRole('button', { name: 'Tối', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Đóng' }).click();

  /*
   * Đọc `data-theme` ở `document-start`, tức TRƯỚC khi React chạy. Đây là toàn bộ điểm
   * của `NFR-PERF-10`: nếu chỉ kiểm sau khi trang tải xong thì một cú nháy trắng vẫn
   * lọt qua — thuộc tính rốt cuộc sẽ đúng, chỉ là đúng sau một khung vẽ sai.
   */
  const early: string[] = [];
  await page.addInitScript(() => {
    (window as unknown as { __themeAtStart?: string | null }).__themeAtStart =
      document.documentElement.getAttribute('data-theme');
  });
  await page.reload();
  early.push(
    (await page.evaluate(
      () => (window as unknown as { __themeAtStart?: string | null }).__themeAtStart,
    )) ?? 'null',
  );

  /*
   * `addInitScript` chạy trước MỌI script của trang, kể cả script trong `<head>` — nên
   * ở đó thuộc tính còn `null`. Cái nó chứng minh là: lúc đó DOM đã có `<html>`, và
   * script chống nháy chạy ngay sau, trước lần vẽ đầu. Phép kiểm thật nằm ở dòng dưới,
   * đọc ngay khi tài liệu vừa có nội dung.
   */
  const atDomContentLoaded = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme'),
  );
  expect(atDomContentLoaded).toBe('dark');
  expect(early).toHaveLength(1);

  // Và nền thật đã là nền tối, không phải nền giấy.
  const paper = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--paper').trim(),
  );
  expect(paper).toBe('#191c20');
});

test('đổi bộ quân vẽ lại bàn ngay, và sống qua reload (FR-20)', async ({ page }) => {
  await page.goto('/');
  await startGame(page, { mode: 'Hai người' });
  await playAt(page, 0, 0);
  await expectMoves(page, 1);

  await page.getByRole('button', { name: 'Cài đặt' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cài đặt' });
  const duck = dialog.getByRole('button', { name: /Vịt/ });
  await duck.click();
  await expect(duck).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Đóng' }).click();

  await page.reload();
  await expectMoves(page, 1);
  await page.getByRole('button', { name: 'Cài đặt' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Cài đặt' }).getByRole('button', { name: /Vịt/ }),
  ).toHaveAttribute('aria-pressed', 'true');
});
