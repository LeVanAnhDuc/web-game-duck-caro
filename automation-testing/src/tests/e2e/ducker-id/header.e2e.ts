import { expect, test } from "@/fixtures";

test.beforeEach(async ({ fakeIssuer }) => {
  await fakeIssuer();
});

for (const width of [375, 360, 320]) {
  test(
    `header 320–375px: nút ≥ 44px, không đè nhau, tên app một dòng, không cuộn ngang — ${width}px`,
    { tag: ["@TC-DUCKERID-012"] },
    async ({ gamePage, page }) => {
      await page.setViewportSize({ width, height: 800 });
      await gamePage.goto();
      await expect(gamePage.account.signInButton()).toBeVisible();

      const buttons = gamePage.header().getByRole("button");
      const boxes: { label: string; x: number; y: number; width: number; height: number }[] = [];
      for (let i = 0; i < (await buttons.count()); i += 1) {
        const el = buttons.nth(i);
        const box = (await el.boundingBox())!;
        const label = (await el.getAttribute("aria-label")) ?? (await el.textContent()) ?? "";
        expect(box.width, `${label} rộng ${box.width}`).toBeGreaterThanOrEqual(44);
        expect(box.height, `${label} cao ${box.height}`).toBeGreaterThanOrEqual(44);
        boxes.push({ label, ...box });
      }
      // The level chip sits among them too: it must not be covered either.
      boxes.push({ label: "badge", ...(await gamePage.badge().boundingBox())! });
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const p = boxes[i]!;
          const q = boxes[j]!;
          const overlap = p.x < q.x + q.width && q.x < p.x + p.width && p.y < q.y + q.height && q.y < p.y + p.height;
          expect(overlap, `${p.label} đè ${q.label}`).toBe(false);
        }
      }
      const word = (await gamePage.wordmark().boundingBox())!;
      expect(word.height, "the wordmark stays on one line").toBeLessThan(28);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    },
  );
}

for (const width of [320, 375, 768, 1440]) {
  test(
    `menu tài khoản nằm trọn trong màn và không làm header nhảy — ${width}px`,
    { tag: ["@TC-DUCKERID-013"] },
    async ({ gamePage, page }) => {
      await page.setViewportSize({ width, height: 800 });
      await gamePage.goto();
      await gamePage.account.signInButton().click();
      await expect(gamePage.account.trigger()).toBeVisible();
      const headerBefore = await gamePage.header().boundingBox();

      await gamePage.account.trigger().click();
      await expect(gamePage.account.menu()).toBeVisible();
      const box = (await gamePage.account.menu().boundingBox())!;
      const position = await gamePage.account.menu().evaluate((el) => getComputedStyle(el).position);
      expect(position).toBe(width < 768 ? "fixed" : "absolute");
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.y + box.height).toBeLessThanOrEqual(800);
      expect(await gamePage.header().boundingBox()).toEqual(headerBefore);
    },
  );
}
