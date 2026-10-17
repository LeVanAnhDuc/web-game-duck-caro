import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
});

test(
  "kéo bàn hai ô sang phải không đặt quân và dời bàn đúng hai ô",
  { tag: ["@TC-BOARD-003", "@smoke"] },
  async ({ gamePage }) => {
    const cell = await gamePage.defaultCell();
    const centre = await gamePage.cellPoint(0, 0);
    await gamePage.drag({ x: centre.x - 150, y: centre.y + 100 }, 2 * cell, 0);
    await expect(gamePage.moveRows()).toHaveCount(0);

    await gamePage.canvas().click({ position: centre });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[-2, 0]]);
  },
);

test(
  "rung tay 6px khi bấm vẫn là một cú bấm, không phải kéo",
  { tag: ["@TC-BOARD-004"] },
  async ({ gamePage }) => {
    const centre = await gamePage.cellPoint(0, 0);
    // From the left third of cell 0,0 to its right third: 6px of travel, under the 10px drag threshold.
    await gamePage.drag({ x: centre.x - 3, y: centre.y }, 6, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[0, 0]]);
  },
);

test(
  "lăn chuột phóng to neo tại con trỏ",
  { tag: ["@TC-BOARD-005"] },
  async ({ gamePage }) => {
    const centre = await gamePage.cellPoint(0, 0);
    // Five notches at 2px each: 32px → 42px, anchored at the pointer, so cell 0,0 stays under it.
    await gamePage.wheel(centre, -5);
    await gamePage.canvas().click({ position: { x: centre.x + 2 * 42, y: centre.y } });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[2, 0]]);
  },
);

test(
  "thu phóng dừng ở 64px khi phóng to và 16px khi thu nhỏ",
  { tag: ["@TC-BOARD-006"] },
  async ({ gamePage }) => {
    const centre = await gamePage.cellPoint(0, 0);
    await gamePage.wheel(centre, -30);
    await gamePage.canvas().click({ position: { x: centre.x + 64, y: centre.y } });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect((await gamePage.moves())[0]).toEqual([1, 0]);

    await gamePage.wheel(centre, 30);
    await gamePage.canvas().click({ position: { x: centre.x + 3 * 16, y: centre.y } });
    await expect(gamePage.moveRows()).toHaveCount(2);
    expect((await gamePage.moves())[1]).toEqual([3, 0]);
  },
);

test(
  "nút Giữa đưa quân đã đánh trở lại khung nhìn sau khi kéo đi xa",
  { tag: ["@TC-BOARD-007"] },
  async ({ gamePage }) => {
    const cell = await gamePage.defaultCell();
    const centre = await gamePage.cellPoint(0, 0);
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(1);

    await gamePage.drag({ x: centre.x - 200, y: centre.y - 200 }, 10 * cell, 6 * cell);
    await gamePage.panelButton(copy.controls.recenter).click();

    await gamePage.canvas().click({ position: centre });
    await expect(gamePage.notice()).toHaveText(copy.notice.cellOccupied);
    await expect(gamePage.moveRows()).toHaveCount(1);
  },
);

test(
  "kéo bàn ra xa 40 ô vẫn đánh được, toạ độ tiếp tục đếm",
  { tag: ["@TC-BOARD-009"] },
  async ({ gamePage }) => {
    const cell = await gamePage.defaultCell();
    const centre = await gamePage.cellPoint(0, 0);
    for (let i = 0; i < 4; i += 1) await gamePage.drag({ x: centre.x - 5 * cell, y: centre.y }, 10 * cell, 0);
    await expect(gamePage.moveRows()).toHaveCount(0);

    await gamePage.canvas().click({ position: centre });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[-40, 0]]);
  },
);
