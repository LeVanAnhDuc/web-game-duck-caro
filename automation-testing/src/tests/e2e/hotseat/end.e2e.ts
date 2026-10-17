import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { storageKey } from "@/data/test-data";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
});

test(
  "Người 2 thắng thì màn kết ván gọi tên Người 2",
  { tag: ["@TC-HOTSEAT-005"] },
  async ({ gamePage }) => {
    // Seat one scatters two cells apart on row -5; seat two builds 0..4 on row 5.
    for (let i = 0; i < 5; i += 1) {
      await gamePage.playAt(-10 + 2 * i, -5);
      await gamePage.playAt(i, 5);
    }
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.two));
    await expect(gamePage.resultTitle()).not.toContainText(copy.seat.you);
    await expect(gamePage.resultTitle()).not.toContainText(copy.seat.machine);
  },
);

test("Bỏ ván do ghế đang tới lượt bỏ", { tag: ["@TC-HOTSEAT-006"] }, async ({ gamePage }) => {
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(1);
  await gamePage.resign();
  await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.two));
});

test(
  "ván hai người không vào thống kê và không hiện bảng Thành tích",
  { tag: ["@TC-HOTSEAT-007"] },
  async ({ gamePage }) => {
    await expect(gamePage.statsTitle()).toHaveCount(0);
    await gamePage.playAt(0, 0);
    await gamePage.resign();
    await expect(gamePage.resultTitle()).toBeVisible();
    await expect(gamePage.statsTitle()).toHaveCount(0);

    const stats = (await gamePage.storage())[storageKey.stats];
    if (stats !== undefined) {
      for (const level of Object.values(JSON.parse(stats) as Record<string, Record<string, number>>)) {
        expect(level).toEqual({ wins: 0, losses: 0, resigns: 0 });
      }
    }

    await gamePage.panelButton(copy.result.playAgain).click();
    await gamePage.startGame({ mode: "vsAi" });
    for (const level of ["easy", "normal", "hard"] as const) {
      await expect(gamePage.statsRow(level)).toContainText(copy.stats.none);
    }
  },
);
