import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { storageKey } from "@/data/test-data";
import type { GamePage } from "@/pages/game.page";

/** Load, play, take a hint, play it, resign, replay: every feature that could reach for the network or storage. */
async function fullRound(gamePage: GamePage): Promise<void> {
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  await gamePage.hint();
  await expect(gamePage.notice()).toHaveText(copy.notice.hintAt, { timeout: 15_000 });
  await gamePage.placeButton().click();
  await expect(gamePage.moveRows()).toHaveCount(4);
  await gamePage.resign();
  await gamePage.enterReview();
  await gamePage.reviewNav("first").click();
  await expect(gamePage.reviewPosition()).toHaveText(copy.review.position(0, 4));
}

test(
  "một ván đầy đủ không gửi request nào ra ngoài origin",
  { tag: ["@TC-PRIVACY-001", "@smoke"] },
  async ({ gamePage, page, urls }) => {
    const own = new URL(urls.webUrl).origin;
    const outside: string[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).origin !== own) outside.push(r.url());
    });
    await fullRound(gamePage);
    expect(outside).toEqual([]);
  },
);

test("trang không đặt cookie nào", { tag: ["@TC-PRIVACY-002"] }, async ({ gamePage, page }) => {
  await fullRound(gamePage);
  expect(await page.context().cookies()).toEqual([]);
});

test(
  "bộ nhớ trình duyệt chỉ chứa khoá của game",
  { tag: ["@TC-PRIVACY-003"] },
  async ({ gamePage, page }) => {
    await fullRound(gamePage);
    const settings = await gamePage.openSettings();
    await settings.option(copy.settings.defaultLevel, copy.level.hard).click();
    await settings.close();

    const keys = Object.keys(await gamePage.storage()).sort();
    expect(keys).toEqual([storageKey.stats, storageKey.settings].sort());
    expect(await page.evaluate(() => window.sessionStorage.length)).toBe(0);
  },
);

test(
  "một ván đầy đủ không có lỗi console hay lỗi trang",
  { tag: ["@TC-PRIVACY-005"] },
  async ({ gamePage, page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await fullRound(gamePage);
    expect(errors).toEqual([]);
  },
);
