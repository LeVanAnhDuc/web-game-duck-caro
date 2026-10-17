import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test("Hoàn lấy lại cả nước của máy", { tag: ["@TC-UNDOHINT-001", "@smoke"] }, async ({ gamePage }) => {
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  const firstPair = await gamePage.moves();
  await gamePage.playAt(2, 2);
  await expect(gamePage.moveRows()).toHaveCount(4);

  await gamePage.undo();
  await expect(gamePage.moveRows()).toHaveCount(2);
  expect(await gamePage.moves()).toEqual(firstPair);

  await gamePage.undo();
  await expect(gamePage.moveRows()).toHaveCount(0);
});

test(
  "máy đi trước, Hoàn còn mỗi nước của máy thì máy đánh lại, ván không đứng",
  { tag: ["@TC-UNDOHINT-002"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ first: "two" });
    await expect(gamePage.moveRows()).toHaveCount(1);

    await gamePage.undo();
    await expect(gamePage.notice()).toHaveText(copy.notice.aiPlacedAt(0, 0));
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[0, 0]]);

    await gamePage.playAt(1, 1);
    await expect(gamePage.moveRows()).toHaveCount(3);
  },
);

test("Hoàn tắt khi ván chưa có nước nào", { tag: ["@TC-UNDOHINT-003"] }, async ({ gamePage }) => {
  await gamePage.startGame();
  await expect(gamePage.panelButton(copy.controls.undo)).toBeDisabled();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);
  await expect(gamePage.panelButton(copy.controls.undo)).toBeEnabled();
});

test(
  "Hoàn trong lúc máy đang nghĩ bỏ nước máy đang tính",
  { tag: ["@TC-UNDOHINT-008"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ level: "hard" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);
    await gamePage.undo();
    await expect(gamePage.moveRows()).toHaveCount(0);

    await gamePage.playAt(5, 5);
    await expect(gamePage.notice()).toHaveText(/^Máy đánh ở /, { timeout: 15_000 });
    await expect(gamePage.moveRows()).toHaveCount(2);
    const moves = await gamePage.moves();
    expect(moves[0]).toEqual([5, 5]);
    expect(moves).not.toContainEqual([0, 0]);
  },
);
