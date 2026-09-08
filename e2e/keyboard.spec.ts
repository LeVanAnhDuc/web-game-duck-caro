import { expect, test } from '@playwright/test';
import { expectMoves, moveCount, tabToCanvas } from './helpers';

/**
 * `NFR-A11Y-02` hứa "một test E2E". Đây là nó.
 *
 * Và nó phải chạy trên BẢN BUILD TĨNH (ADR-0022): overlay dev-tools của Next là một
 * phần tử thật trong thứ tự Tab, nên cùng bài test này trên `next dev` sẽ đo một cây
 * focus không tồn tại ở production.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('canvas nằm trong thứ tự Tab, không bị bỏ ngoài (NFR-A11Y-02)', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Tắt âm thanh' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cài đặt' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('canvas')).toBeFocused();
});

test('chơi được chỉ bằng bàn phím, không một cú chuột nào (NFR-A11Y-02 · FR-15)', async ({
  page,
}) => {
  // Mở ván bằng bàn phím: Tab tới nút, Enter.
  await page.getByRole('button', { name: 'Dễ', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Bắt đầu ván mới' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Bắt đầu ván mới' })).toBeHidden();

  // Từ đây trở đi chỉ có bàn phím, và focus đi vào canvas bằng Tab THẬT.
  await tabToCanvas(page);
  await expect(page.locator('canvas')).toBeFocused();

  // Mũi tên đặt rồi dịch con trỏ; vùng live thứ hai đọc vị trí và tình trạng ô.
  await page.keyboard.press('ArrowRight');
  // Bó vào cột phải: `CursorLive` render HAI lần (mobile + desktop), và bản mobile
  // đang `display:none` ở khổ 1280 — `.first()` sẽ chọn đúng bản vô hình đó.
  await expect(
    page.locator('aside').getByText(/^Con trỏ ở .*Ô trống\.$/),
  ).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');

  await page.keyboard.press('Enter');
  await expectMoves(page, 2);

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter');
  await expectMoves(page, 4);

  // `u` hoàn nước, `h` gợi ý — cả hai không cần chuột.
  await page.keyboard.press('u');
  await expectMoves(page, 2);
  await page.keyboard.press('h');
  await expect(page.locator('aside').getByText(/^Gợi ý: đánh ở /)).toBeVisible({
    timeout: 15_000,
  });
  expect(await moveCount(page)).toBe(2);
});

test('vùng live của con trỏ nói ô đã có quân TRƯỚC khi bấm (NFR-A11Y-06)', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Dễ', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu ván mới' }).click();
  await page.locator('canvas').focus();

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expectMoves(page, 2);
  // Con trỏ vẫn đứng trên ô vừa đánh, nên vùng live phải nói ô đó là quân của mình.
  await expect(
    page.locator('aside').getByText(/Ô này là quân của bạn\.$/),
  ).toBeVisible();
});

test('Shift + mũi tên kéo bàn, không đánh quân nào', async ({ page }) => {
  await page.getByRole('button', { name: 'Dễ', exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu ván mới' }).click();
  await page.locator('canvas').focus();

  for (let i = 0; i < 6; i += 1) await page.keyboard.press('Shift+ArrowRight');
  expect(await moveCount(page)).toBe(0);
});

test('phím lạ không chặn Tab — người dùng bàn phím không bị kẹt trong canvas', async ({
  page,
}) => {
  await page.locator('canvas').focus();
  await page.keyboard.press('q');
  await page.keyboard.press('Tab');
  await expect(page.locator('canvas')).not.toBeFocused();
});
