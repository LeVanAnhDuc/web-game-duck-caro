import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import type { Cell } from "@/data/test-data";

/**
 * Seat two blocks -1,0 first, seat one fills 0..4,0, seat two blocks 5,0 on the way: a five closed at both ends by
 * enemy marks. The same position wins under Tự do and does not under Caro Việt (ADR-0025, invariant 3).
 */
const BLOCKED_BOTH_ENDS: Cell[] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [5, 0],
  [2, 0],
  [9, 9],
  [3, 0],
  [8, 8],
  [4, 0],
];

test(
  "luật Caro Việt: năm quân bị chặn hai đầu không thắng",
  { tag: ["@TC-WINRULE-004", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", rule: "blocked" });
    await gamePage.playAll(BLOCKED_BOTH_ENDS);
    await expect(gamePage.moveRows()).toHaveCount(9);
    await expect(gamePage.resultTitle()).toHaveCount(0);

    // Not won means the game goes on: seat two can still move.
    await gamePage.playAt(-6, 6);
    await expect(gamePage.moveRows()).toHaveCount(10);
    await expect(gamePage.resultTitle()).toHaveCount(0);
  },
);

test(
  "luật Caro Việt: sáu quân bị chặn hai đầu cũng không thắng",
  { tag: ["@TC-WINRULE-005"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", rule: "blocked" });
    // One: 0,1,2,3,5 then 4 → a run of six from 0 to 5. Two: -1 and 6 close both ends, the rest far away.
    await gamePage.playAll([
      [0, 0],
      [-1, 0],
      [1, 0],
      [6, 0],
      [2, 0],
      [9, 9],
      [3, 0],
      [8, 8],
      [5, 0],
      [7, 7],
      [4, 0],
    ]);
    await expect(gamePage.moveRows()).toHaveCount(11);
    await expect(gamePage.resultTitle()).toHaveCount(0);
    await gamePage.playAt(-6, 6);
    await expect(gamePage.moveRows()).toHaveCount(12);
  },
);

test(
  "luật Caro Việt: năm quân bị chặn một đầu vẫn thắng",
  { tag: ["@TC-WINRULE-006"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", rule: "blocked" });
    await gamePage.playAll([
      [0, 0],
      [-1, 0],
      [1, 0],
      [9, 9],
      [2, 0],
      [8, 8],
      [3, 0],
      [7, 7],
      [4, 0],
    ]);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
  },
);

test(
  "luật Tự do: năm quân bị chặn hai đầu vẫn thắng",
  { tag: ["@TC-WINRULE-007", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ mode: "hotseat", rule: "free" });
    await gamePage.playAll(BLOCKED_BOTH_ENDS);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
    await expect(gamePage.moveRows()).toHaveCount(9);
  },
);
