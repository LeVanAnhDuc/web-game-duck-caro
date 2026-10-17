import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { settingsBlob, statsBlob, storageKey } from "@/data/test-data";
import type { GamePage } from "@/pages/game.page";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.plant({
    [storageKey.stats]: statsBlob({ easy: { wins: 3 } }),
    [storageKey.settings]: settingsBlob({ defaultLevel: "easy" }),
  });
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
});

const ownKeys = async (gamePage: GamePage) =>
  Object.keys(await gamePage.storage())
    .filter((k) => k.startsWith(storageKey.prefix))
    .sort();

test(
  "Xoá toàn bộ dữ liệu hỏi xác nhận và Thôi thì không xoá gì",
  { tag: ["@TC-SETTINGS-009"] },
  async ({ gamePage }) => {
    const before = await ownKeys(gamePage);
    expect(before).toEqual([storageKey.currentGame, storageKey.stats, storageKey.settings].sort());

    const settings = await gamePage.openSettings();
    await settings.clearAllButton().click();
    await expect(settings.root().getByText(copy.settings.clearAllWarning, { exact: true })).toBeVisible();

    await settings.cancelClearButton().click();
    await expect(settings.clearAllButton()).toBeVisible();
    expect(await ownKeys(gamePage)).toEqual(before);
  },
);

test(
  "Xoá hẳn xoá ván đang dở, thống kê và cài đặt",
  { tag: ["@TC-SETTINGS-010", "@smoke"] },
  async ({ gamePage }) => {
    const settings = await gamePage.openSettings();
    await settings.clearAllButton().click();
    await settings.confirmClearButton().click();
    expect(await ownKeys(gamePage)).toEqual([]);
  },
);
