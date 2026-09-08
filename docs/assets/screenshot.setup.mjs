// Lai game vao khung hinh dung de chup anh README.
// Chay boi web-game/.claude/skills/readme-game/scripts/capture-screenshots.mjs.
// Khong co file nay thi anh chup ra modal "Bat dau van moi" che het ban co.
//
// Hop dong: export default async (page) => {...}. Viewport la 1280x720.

export default async function setup(page) {
  await page.getByRole('button', { name: 'Bắt đầu ván mới' }).click();
  await page.waitForTimeout(400);

  // Ban co la canvas nen phai danh bang toa do. Danh vai nuoc quanh tam de anh
  // co quan tren ban thay vi mot luoi trong. Sau moi nuoc, doi may tra loi.
  const board = page.locator('canvas').first();
  const box = await board.boundingBox();
  if (!box) return;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const step = 34; // ~mot o o muc zoom mac dinh
  const moves = [
    [0, 0],
    [step, -step],
    [-step, step],
    [step * 2, 0],
  ];
  for (const [dx, dy] of moves) {
    await page.mouse.click(cx + dx, cy + dy);
    await page.waitForTimeout(700); // may suy nghi
  }
}
