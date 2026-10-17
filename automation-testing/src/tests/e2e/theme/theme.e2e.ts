import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { luma, paper } from "@/data/test-data";

test.beforeEach(async ({ page, gamePage }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await gamePage.goto();
});

test(
  "mặc định Theo máy: giao diện theo hệ điều hành và đổi ngay khi hệ đổi",
  { tag: ["@TC-THEME-001", "@smoke"] },
  async ({ gamePage, page }) => {
    const settings = await gamePage.openSettings();
    await expect(settings.option(copy.settings.theme, copy.settings.system)).toHaveAttribute("aria-pressed", "true");
    expect(await gamePage.themeAttr()).toBeNull();
    expect(await gamePage.paper()).toBe(paper.light);

    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(() => gamePage.paper()).toBe(paper.dark);
    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(() => gamePage.paper()).toBe(paper.light);
  },
);

test(
  "chọn Tối hoặc Sáng áp ngay và thắng hệ điều hành theo cả hai chiều",
  { tag: ["@TC-THEME-002", "@smoke"] },
  async ({ gamePage, page }) => {
    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.theme, copy.settings.dark).click();
    await expect(settings.option(copy.settings.theme, copy.settings.dark)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => gamePage.paper()).toBe(paper.dark);

    await page.emulateMedia({ colorScheme: "dark" });
    await settings.option(copy.settings.theme, copy.settings.light).click();
    await expect(settings.option(copy.settings.theme, copy.settings.light)).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => gamePage.paper()).toBe(paper.light);
  },
);

test("lựa chọn giao diện sống qua tải lại", { tag: ["@TC-THEME-003"] }, async ({ gamePage, page }) => {
  let settings = await gamePage.openSettings();
  await settings.option(copy.settings.theme, copy.settings.dark).click();
  await settings.close();

  await page.reload();
  expect(await gamePage.paper()).toBe(paper.dark);
  settings = await gamePage.openSettings();
  await expect(settings.option(copy.settings.theme, copy.settings.dark)).toHaveAttribute("aria-pressed", "true");
});

test(
  "bàn vẽ lại bằng bảng màu mới ngay khi chọn giao diện",
  { tag: ["@TC-THEME-005"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ mode: "hotseat" });
    const at = await gamePage.cellPoint(3, 3);
    const before = await gamePage.pixel(at);
    expect(luma(before)).toBeGreaterThan(200);

    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.theme, copy.settings.dark).click();
    await settings.close();
    await expect.poll(async () => luma(await gamePage.pixel(at))).toBeLessThan(60);
  },
);

test(
  "ở Theo máy, hệ đổi sang tối thì bàn vẽ lại tối",
  { tag: ["@TC-THEME-006"] },
  async ({ gamePage, page }) => {
    await gamePage.startGame({ mode: "hotseat" });
    const at = await gamePage.cellPoint(3, 3);
    expect(luma(await gamePage.pixel(at))).toBeGreaterThan(200);

    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(async () => luma(await gamePage.pixel(at))).toBeLessThan(60);
  },
);

test("đổi giao diện giữa ván không ảnh hưởng ván", { tag: ["@TC-THEME-007"] }, async ({ gamePage }) => {
  await gamePage.startGame({ mode: "hotseat" });
  await gamePage.playAll([
    [0, 0],
    [1, 0],
    [2, 2],
  ]);
  const before = await gamePage.moves();

  const settings = await gamePage.openSettings();
  await settings.option(copy.settings.theme, copy.settings.dark).click();
  await settings.close();

  expect(await gamePage.moves()).toEqual(before);
  await expect(gamePage.seat("two")).toHaveCSS("font-weight", "600");
  await gamePage.playAt(-3, -3);
  await expect(gamePage.moveRows()).toHaveCount(4);
});
