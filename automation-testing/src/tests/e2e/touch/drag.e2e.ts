import { expect, test } from "@/fixtures";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat" });
});

test(
  "ngón tay kéo đi rồi quay về là kéo, không phải chạm",
  { tag: ["@TC-TOUCH-005"] },
  async ({ gamePage }) => {
    // Out 40px and back: the finger ends where it started, but it travelled 80px, so it is a drag (ADR-0007).
    await gamePage.touchStroke(await gamePage.cellPoint(0, 0), [
      [10, 0],
      [20, 0],
      [30, 0],
      [40, 0],
      [30, 0],
      [20, 0],
      [10, 0],
      [0, 0],
    ]);
    await expect(gamePage.placeButton()).toHaveCount(0);
    expect(await gamePage.moveCount()).toBe(0);
  },
);

test("rung tay 4px khi chạm vẫn là chạm", { tag: ["@TC-TOUCH-006"] }, async ({ gamePage }) => {
  const centre = await gamePage.cellPoint(0, 0);
  await gamePage.touchStroke({ x: centre.x - 2, y: centre.y }, [
    [2, 0],
    [4, 0],
  ]);
  await expect(gamePage.placeButton()).toBeVisible();
  expect(await gamePage.moveCount()).toBe(0);
});
