import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

const PHONE = { width: 375, height: 812 };

test(
  "không cuộn ngang ở mọi khổ từ 320 đến 1440px",
  { tag: ["@TC-RESPONSIVE-001"] },
  async ({ gamePage, page }) => {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await gamePage.goto();
      const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(await overflow(), `${width}px, start screen`).toBeLessThanOrEqual(0);

      await gamePage.startGame({ mode: "hotseat" });
      await gamePage.playAt(1, 0);
      await expect.poll(() => gamePage.moveCount()).toBe(1);
      expect(await overflow(), `${width}px, in a game`).toBeLessThanOrEqual(0);
      await page.evaluate(() => window.localStorage.clear());
    }
  },
);

test(
  "từ 1024px có cột phải và không có thanh nút đáy",
  { tag: ["@TC-RESPONSIVE-002"] },
  async ({ gamePage, page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await gamePage.goto();
    await gamePage.startGame();
    await expect(gamePage.panel()).toBeVisible();
    await expect(gamePage.panel().getByText(copy.moveList.title, { exact: true })).toBeVisible();
    await expect(gamePage.statsTitle()).toBeVisible();
    for (const name of [copy.controls.undo, copy.controls.hint, copy.controls.recenter, copy.controls.resign]) {
      await expect(gamePage.panelButton(name)).toBeVisible();
    }
    await expect(gamePage.bottomBar()).toBeHidden();
  },
);

test.describe("điện thoại 375px", () => {
  test.use({ viewport: PHONE });

  test(
    "ở 375px không có cột phải, có thanh nút đáy và chơi được",
    { tag: ["@TC-RESPONSIVE-003", "@smoke"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startGame({ mode: "hotseat" });
      await expect(gamePage.panel()).toBeHidden();
      const bar = gamePage.bottomBar();
      await expect(bar.getByRole("button")).toHaveCount(4);
      for (const name of [copy.controls.undo, copy.controls.hint, copy.controls.recenter, copy.controls.resign]) {
        await expect(bar.getByRole("button", { name, exact: true })).toBeVisible();
      }

      await gamePage.playAt(1, 0);
      await expect(gamePage.noticeBar()).toHaveText(copy.notice.movedAt(copy.seat.one, 1, 0));
      await bar.getByRole("button", { name: copy.controls.undo, exact: true }).click();
      await expect.poll(() => gamePage.moveCount()).toBe(0);
    },
  );

  test(
    "trên thanh nút hẹp, Bỏ ván chỉ còn icon nhưng vẫn có tên và 44px",
    { tag: ["@TC-RESPONSIVE-004"] },
    async ({ gamePage }) => {
      await gamePage.goto();
      await gamePage.startGame();
      const resign = gamePage.bottomBar().getByRole("button", { name: copy.controls.resign, exact: true });
      await expect(resign).toBeVisible();
      await expect(resign.getByText(copy.controls.resign)).toBeHidden();
      const box = (await resign.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    },
  );

  test(
    "ở 375px kết ván là sheet có Chơi lại và Xem lại, xem lại là sheet đáy",
    { tag: ["@TC-RESPONSIVE-006"] },
    async ({ gamePage, page }) => {
      await gamePage.goto();
      await gamePage.startGame({ mode: "hotseat" });
      await gamePage.playAt(0, 0);
      await gamePage.playAt(1, 1);
      await expect.poll(() => gamePage.moveCount()).toBe(2);
      await gamePage.bottomBar().getByRole("button", { name: copy.controls.resign, exact: true }).click();

      await expect(gamePage.sheetResultTitle()).toHaveText(copy.result.resigned(copy.seat.one));
      await expect(page.getByRole("button", { name: copy.result.playAgain, exact: true })).toBeVisible();
      await page.getByRole("button", { name: copy.result.review, exact: true }).click();

      await expect(page.getByText(copy.review.reviewing, { exact: true }).filter({ visible: true })).toBeVisible();
      await expect(page.getByText(copy.review.position(2, 2), { exact: true }).filter({ visible: true })).toBeVisible();
      await page.getByRole("button", { name: copy.review.prev, exact: true }).click();
      await expect(page.getByText(copy.review.position(1, 2), { exact: true }).filter({ visible: true })).toBeVisible();
    },
  );
});

test(
  "Cài đặt là sheet đáy ở 375px và cột phải ở 1280px",
  { tag: ["@TC-RESPONSIVE-005"] },
  async ({ gamePage, page }) => {
    await page.setViewportSize(PHONE);
    await gamePage.goto();
    let settings = await gamePage.openSettings();
    let box = (await settings.root().boundingBox())!;
    const stage = (await gamePage.canvas().locator("..").locator("..").boundingBox())!;
    expect(Math.round(box.width)).toBe(PHONE.width);
    expect(Math.round(box.y + box.height)).toBe(Math.round(stage.y + stage.height));
    await settings.close();

    await page.setViewportSize({ width: 1280, height: 900 });
    settings = await gamePage.openSettings();
    box = (await settings.root().boundingBox())!;
    expect(Math.round(box.x + box.width)).toBe(1280);
    expect(Math.round(box.width)).toBe(320);
    expect(Math.round(box.height)).toBe(900);
  },
);

test(
  "ô mở với 28px khi canvas ≤ 640px và 32px khi rộng hơn",
  { tag: ["@TC-RESPONSIVE-007"] },
  async ({ gamePage, page }) => {
    for (const [width, cell] of [
      [375, 28],
      [768, 32],
    ] as const) {
      await page.setViewportSize({ width, height: 812 });
      await gamePage.goto();
      await gamePage.startGame({ mode: "hotseat" });
      const box = await gamePage.canvasBox();
      await gamePage.canvas().click({ position: { x: box.width / 2 + cell, y: box.height / 2 } });
      await expect(gamePage.noticeBar()).toHaveText(copy.notice.movedAt(copy.seat.one, 1, 0));
      await page.evaluate(() => window.localStorage.clear());
    }
  },
);
