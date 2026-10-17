import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { interleave, savedGame, storageKey } from "@/data/test-data";

test(
  "máy chặn ô duy nhất còn lại của đường bốn",
  { tag: ["@TC-OPPONENT-006"] },
  async ({ gamePage }) => {
    // Human (first) holds 0..3,0; the machine already sits on -1,0; seven moves, so it is the machine's turn.
    const moves = interleave(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      [
        [-1, 0],
        [5, 5],
        [6, 7],
      ],
    );
    await gamePage.plant({ [storageKey.currentGame]: savedGame({ moves, level: "normal" }) });
    await gamePage.goto();

    await expect(gamePage.moveRows()).toHaveCount(8, { timeout: 15_000 });
    expect((await gamePage.moves())[7]).toEqual([4, 0]);
  },
);

test(
  "máy đi nước thắng khi có và ván kết thúc \"Máy thắng\"",
  { tag: ["@TC-OPPONENT-007"] },
  async ({ gamePage }) => {
    // The machine holds 0..3,0 open at both ends; the human's moves are scattered and it is the human's turn.
    const moves = interleave(
      [
        [10, 10],
        [12, 12],
        [14, 10],
        [10, 14],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
    );
    await gamePage.plant({ [storageKey.currentGame]: savedGame({ moves, level: "normal" }) });
    await gamePage.goto();
    await expect(gamePage.moveRows()).toHaveCount(8);

    await gamePage.playAt(-6, 6);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.machine), { timeout: 15_000 });
    await expect(gamePage.panel().getByText(copy.result.moveCount(10), { exact: true })).toBeVisible();
    const last = (await gamePage.moves())[9]!;
    expect(last[1]).toBe(0);
    expect([-1, 4]).toContain(last[0]);
  },
);
