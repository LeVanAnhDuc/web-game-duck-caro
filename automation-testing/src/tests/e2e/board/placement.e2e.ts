import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test(
  "ván mới mở với bàn trống và nước đầu ở giữa khung nhìn là ô 0, 0",
  { tag: ["@TC-BOARD-001", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ mode: "hotseat" });
    await expect(gamePage.moveRows()).toHaveCount(0);
    await expect(gamePage.notice()).toHaveText(copy.notice.dragHint);

    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[0, 0]]);
  },
);

test(
  "bấm chuột đặt quân đúng ô dưới con trỏ, kể cả toạ độ âm",
  { tag: ["@TC-BOARD-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ mode: "hotseat" });
    await gamePage.playAt(3, 1);
    await gamePage.playAt(-2, -3);

    await expect(gamePage.moveRows()).toHaveCount(2);
    expect(await gamePage.moves()).toEqual([
      [3, 1],
      [-2, -3],
    ]);
    // The list prints the real minus sign (U+2212), right-aligned, so the coordinate column lines up.
    await expect(gamePage.moveRows().nth(1)).toContainText(copy.moveList.coord(-2, -3));
  },
);

test(
  "đánh vào ô đã có quân bị từ chối và có thông báo",
  { tag: ["@TC-BOARD-008", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);

    await gamePage.playAt(0, 0);
    await expect(gamePage.notice()).toHaveText(copy.notice.cellOccupied);
    await expect(gamePage.moveRows()).toHaveCount(2);
  },
);

test(
  "bấm đúp thật nhanh vào một ô chỉ tạo một nước",
  { tag: ["@TC-BOARD-010"] },
  async ({ gamePage }) => {
    await gamePage.startGame();
    await gamePage.canvas().dblclick({ position: await gamePage.cellPoint(3, 3) });
    await expect(gamePage.moveRows()).toHaveCount(2);
    // The machine's reply is the second row; a second human move would make a third.
    await expect(gamePage.notice()).toHaveText(/^Máy đánh ở /);
    await expect(gamePage.moveRows()).toHaveCount(2);
    expect((await gamePage.moves())[0]).toEqual([3, 3]);
  },
);
