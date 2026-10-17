import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import type { Cell } from "@/data/test-data";

const GAME: Cell[] = [
  [0, 0],
  [-1, 0],
  [1, 1],
  [-2, -3],
];

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
});

test(
  "danh sách ghi từng nước với số thứ tự và toạ độ có dấu trừ thật",
  { tag: ["@TC-HISTORYREVIEW-001"] },
  async ({ gamePage }) => {
    await gamePage.playAll(GAME);
    await expect(gamePage.moveRows()).toHaveCount(4);
    for (let i = 0; i < 4; i += 1) {
      await expect(gamePage.moveRows().nth(i)).toContainText(String(i + 1));
      await expect(gamePage.moveRows().nth(i)).toContainText(copy.moveList.coord(GAME[i]![0], GAME[i]![1]));
    }
    await expect(gamePage.moveRows().nth(3)).toContainText("−2,  −3");
  },
);

test(
  "ván dài: nước mới nhất luôn hiện trong danh sách",
  { tag: ["@TC-HISTORYREVIEW-002"] },
  async ({ gamePage }) => {
    // Forty cells two apart in both directions: no two stones touch, so nobody can win.
    const cells: Cell[] = [];
    for (let y = -6; y <= 0; y += 2) for (let x = -10; x <= 8; x += 2) cells.push([x, y]);
    await gamePage.playAll(cells);
    await expect(gamePage.moveRows()).toHaveCount(40);
    await expect(gamePage.moveRows().last()).toBeInViewport();
    await expect(gamePage.moveRows().first()).not.toBeInViewport();
  },
);

test(
  "trong lúc chơi danh sách không bấm được và không có Xem lại",
  { tag: ["@TC-HISTORYREVIEW-003"] },
  async ({ gamePage }) => {
    await gamePage.playAll(GAME);
    await expect(gamePage.moveRows()).toHaveCount(4);
    await expect(gamePage.reviewRows()).toHaveCount(0);
    await expect(gamePage.panelButton(copy.result.review)).toHaveCount(0);
  },
);
