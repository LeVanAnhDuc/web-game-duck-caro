import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { interleave, type Cell } from "@/data/test-data";

// Seat two plays on row 5, two cells apart, so it never blocks seat one and never makes a line of its own.
// (Everything stays within ±12 cells of the centre: the 1280×900 canvas shows about 30×24 cells.)
const FAR: Cell[] = [
  [-10, 5],
  [-8, 5],
  [-6, 5],
  [-4, 5],
  [-12, 5],
];

const row = (cells: number[]): Cell[] => cells.map((x) => [x, 0] as Cell);

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
  await gamePage.startGame({ mode: "hotseat", rule: "blocked" });
});

test(
  "năm quân ngang không bị chặn thắng và màn kết ván gọi tên ghế",
  { tag: ["@TC-WINRULE-001", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.playAll(interleave(row([0, 1, 2, 3, 4]), FAR));
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
    await expect(gamePage.panel().getByText(copy.result.moveCount(9), { exact: true })).toBeVisible();
    await expect(gamePage.notice()).toHaveText(copy.notice.wonAt(copy.seat.one, 4, 0));
  },
);

const LINES: Record<string, Cell[]> = {
  dọc: [0, 1, 2, 3, 4].map((i) => [0, i] as Cell),
  "chéo xuống": [0, 1, 2, 3, 4].map((i) => [i, i] as Cell),
  "chéo lên": [0, 1, 2, 3, 4].map((i) => [i, -i] as Cell),
};

for (const [name, line] of Object.entries(LINES)) {
  test(`năm quân thắng theo dọc và hai đường chéo — ${name}`, { tag: ["@TC-WINRULE-002"] }, async ({ gamePage }) => {
    await gamePage.playAll(interleave(line, FAR));
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
    await expect(gamePage.moveRows()).toHaveCount(9);
  });
}

test("bốn quân liền chưa thắng và ván đi tiếp", { tag: ["@TC-WINRULE-003"] }, async ({ gamePage }) => {
  await gamePage.playAll(interleave(row([0, 1, 2, 3]), FAR.slice(0, 3)));
  await expect(gamePage.moveRows()).toHaveCount(7);
  await expect(gamePage.resultTitle()).toHaveCount(0);

  await gamePage.playAt(-5, -5);
  await expect(gamePage.moveRows()).toHaveCount(8);
  await expect(gamePage.resultTitle()).toHaveCount(0);
});

test("sáu quân liền không bị chặn vẫn thắng", { tag: ["@TC-WINRULE-008"] }, async ({ gamePage }) => {
  // 0..3 and 5 first (no five yet), then 4 joins them into one run of six.
  await gamePage.playAll(interleave(row([0, 1, 2, 3, 5]), FAR.slice(0, 4)));
  await expect(gamePage.moveRows()).toHaveCount(9);
  await expect(gamePage.resultTitle()).toHaveCount(0);

  await gamePage.playAt(-10, 9);
  await gamePage.playAt(4, 0);
  await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));
  await expect(gamePage.moveRows()).toHaveCount(11);
});

test(
  "ván đã kết thúc khoá bàn và các nút đang chơi",
  { tag: ["@TC-WINRULE-010"] },
  async ({ gamePage }) => {
    await gamePage.playAll(interleave(row([0, 1, 2, 3, 4]), FAR));
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.one));

    await gamePage.playAt(-3, 3);
    await expect(gamePage.moveRows()).toHaveCount(9);
    for (const name of [copy.controls.undo, copy.controls.hint, copy.controls.resign]) {
      await expect(gamePage.panelButton(name)).toBeDisabled();
    }
    await expect(gamePage.panelButton(copy.result.playAgain)).toBeVisible();
    await expect(gamePage.panelButton(copy.result.review)).toBeVisible();
  },
);
