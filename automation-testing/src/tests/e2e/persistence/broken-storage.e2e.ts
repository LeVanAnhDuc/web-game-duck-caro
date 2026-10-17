import { expect, test } from "@/fixtures";
import { storageKey } from "@/data/test-data";

let pageErrors: string[];

test.beforeEach(async ({ page }) => {
  pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
});

test.afterEach(() => {
  // Allowed to forget, never allowed to break (NFR-REL-04): no uncaught error, whatever storage did.
  expect(pageErrors).toEqual([]);
});

test(
  "localStorage bị chặn thì vẫn chơi được, quên ván và không báo lỗi",
  { tag: ["@TC-PERSISTENCE-005"] },
  async ({ gamePage, page }) => {
    await gamePage.blockStorage();
    await gamePage.goto();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await expect(gamePage.notice()).not.toContainText("lỗi");

    await page.reload();
    await expect(gamePage.startButton()).toBeVisible();
  },
);

test(
  "ván lưu bị hỏng thì bị bỏ và vào màn bắt đầu",
  { tag: ["@TC-PERSISTENCE-006"] },
  async ({ gamePage }) => {
    await gamePage.plant({ [storageKey.currentGame]: "{not json" });
    await gamePage.goto();
    await expect(gamePage.startButton()).toBeVisible();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
  },
);

test(
  "ván lưu theo định dạng cũ (v1) bị bỏ, không vỡ",
  { tag: ["@TC-PERSISTENCE-007"] },
  async ({ gamePage }) => {
    // v1 named the seats by who held them: side "human" / "ai", first "human" (design v2 §6 drops it, no migration).
    const v1 = JSON.stringify({
      moves: [
        { at: { x: 0, y: 0 }, side: "human" },
        { at: { x: 1, y: 0 }, side: "ai" },
      ],
      first: "human",
      level: "easy",
      savedAt: "2026-09-01T00:00:00.000Z",
    });
    await gamePage.plant({ [storageKey.currentGame]: v1 });
    await gamePage.goto();
    await expect(gamePage.startButton()).toBeVisible();
  },
);

test(
  "bộ nhớ đầy thì vẫn chơi được và máy vẫn trả lời",
  { tag: ["@TC-PERSISTENCE-008"] },
  async ({ gamePage }) => {
    await gamePage.fillStorage();
    await gamePage.goto();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.playAt(2, 2);
    await expect(gamePage.moveRows()).toHaveCount(4);
  },
);
