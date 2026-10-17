import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { interleave, savedGame, storageKey, type Cell, type Level } from "@/data/test-data";
import { GamePage } from "@/pages/game.page";

/** Asks for a hint and returns the cell it names. Hints run the hard engine (~1s), so wait on the text. */
async function askHint(gamePage: GamePage): Promise<[number, number]> {
  await gamePage.hint();
  await expect(gamePage.notice()).toHaveText(copy.notice.hintAt, { timeout: 15_000 });
  const m = (await gamePage.notice().innerText()).match(copy.notice.hintAt)!;
  return [Number(m[1]), Number(m[2])];
}

test(
  "Gợi ý không thêm nước nào và hiện ô gợi ý cùng nút Đánh",
  { tag: ["@TC-UNDOHINT-004", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);

    await askHint(gamePage);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await expect(gamePage.placeButton()).toBeVisible();
  },
);

test("bấm Đánh đặt quân đúng ô gợi ý", { tag: ["@TC-UNDOHINT-005"] }, async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame();
  await gamePage.playAt(0, 0);
  await expect(gamePage.moveRows()).toHaveCount(2);

  const hinted = await askHint(gamePage);
  await gamePage.placeButton().click();
  await expect(gamePage.placeButton()).toHaveCount(0);
  await expect(gamePage.moveRows()).toHaveCount(4);
  expect((await gamePage.moves())[2]).toEqual(hinted);
});

const POSITION: Cell[] = [
  [0, 0],
  [1, 1],
  [1, 0],
  [2, 2],
];

test(
  "cùng thế cờ, gợi ý ở mức Dễ trùng gợi ý ở mức Khó",
  { tag: ["@TC-UNDOHINT-006"] },
  async ({ browser }) => {
    const hints: Record<string, [number, number]> = {};
    for (const level of ["easy", "hard"] as Level[]) {
      // A fresh context per level: each starts from its own planted save (a second page, so `new GamePage`).
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const game = new GamePage(await context.newPage());
      await game.plant({ [storageKey.currentGame]: savedGame({ moves: POSITION, level }) });
      await game.goto();
      await expect(game.moveRows()).toHaveCount(4);
      hints[level] = await askHint(game);
      await context.close();
    }
    expect(hints.easy).toEqual(hints.hard);
  },
);

test(
  "gợi ý chỉ ra nước thắng ngay khi người chơi có",
  { tag: ["@TC-UNDOHINT-007"] },
  async ({ gamePage }) => {
    const moves = interleave(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      [
        [0, 5],
        [3, 7],
        [-4, -4],
        [6, -3],
      ],
    );
    await gamePage.plant({ [storageKey.currentGame]: savedGame({ moves, level: "easy" }) });
    await gamePage.goto();
    await expect(gamePage.moveRows()).toHaveCount(8);

    const hinted = await askHint(gamePage);
    expect([
      [4, 0],
      [-1, 0],
    ]).toContainEqual(hinted);
  },
);
