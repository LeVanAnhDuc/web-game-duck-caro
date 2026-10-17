import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";
import { interleave, savedGame, storageKey, type Cell } from "@/data/test-data";

const LINE: Cell[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [3, 0],
];
const SCATTER: Cell[] = [
  [0, 5],
  [3, 7],
  [-4, -4],
  [6, -3],
];

test(
  "Bỏ ván kết thúc ván và cộng một lần bỏ ở đúng mức",
  { tag: ["@TC-STATS-001", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ level: "easy" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.resign();
    await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.you));
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.line(0, 0, 1));
  },
);

test(
  "thắng máy cộng một lần thắng ở đúng mức",
  { tag: ["@TC-STATS-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.plant({
      [storageKey.currentGame]: savedGame({ moves: interleave(LINE, SCATTER), level: "easy" }),
    });
    await gamePage.goto();
    await expect(gamePage.moveRows()).toHaveCount(8);
    await gamePage.playAt(4, 0);
    await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.you));
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.line(1, 0, 0));
  },
);

test("thua máy cộng một lần thua ở đúng mức", { tag: ["@TC-STATS-003"] }, async ({ gamePage }) => {
  // The machine (second) holds an open four; the human plays elsewhere and the machine completes five.
  await gamePage.plant({
    [storageKey.currentGame]: savedGame({ moves: interleave(SCATTER, LINE), level: "normal" }),
  });
  await gamePage.goto();
  await expect(gamePage.moveRows()).toHaveCount(8);
  await gamePage.playAt(-6, 6);
  await expect(gamePage.resultTitle()).toHaveText(copy.result.wins(copy.seat.machine), { timeout: 15_000 });
  await expect(gamePage.statsRow("normal")).toContainText(copy.stats.line(0, 1, 0));
});

test(
  "một ván chỉ được đếm một lần dù đổi kích thước hay tải lại",
  { tag: ["@TC-STATS-004"] },
  async ({ gamePage, page }) => {
    await gamePage.goto();
    await gamePage.startGame({ level: "easy" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.resign();
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.line(0, 0, 1));

    // Each resize is a new render with the finished status; without a once-only guard one resign counts many times.
    for (const width of [1100, 1280, 1180]) await page.setViewportSize({ width, height: 900 });
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.line(0, 0, 1));

    await page.reload();
    await gamePage.startGame({ level: "easy" });
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.line(0, 0, 1));
  },
);

test(
  "thành tích tách theo mức và bảng làm nổi mức đang chơi",
  { tag: ["@TC-STATS-005"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ level: "normal" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);
    await gamePage.resign();

    await expect(gamePage.statsRow("normal")).toContainText(copy.stats.line(0, 0, 1));
    await expect(gamePage.statsRow("easy")).toContainText(copy.stats.none);
    await expect(gamePage.statsRow("hard")).toContainText(copy.stats.none);

    const label = (level: "easy" | "normal" | "hard") =>
      gamePage.panel().getByText(copy.level[level], { exact: true });
    await expect(label("normal")).toHaveCSS("font-weight", "500");
    await expect(label("easy")).toHaveCSS("font-weight", "400");
    await expect(label("hard")).toHaveCSS("font-weight", "400");
  },
);

test(
  "bỏ ván trong lúc máy đang nghĩ thì người chơi là bên bỏ",
  { tag: ["@TC-STATS-008"] },
  async ({ gamePage }) => {
    await gamePage.goto();
    await gamePage.startGame({ level: "hard" });
    await gamePage.playAt(0, 0);
    await expect(gamePage.seat("two")).toHaveText(copy.notice.aiThinking);
    await gamePage.resign();

    await expect(gamePage.resultTitle()).toHaveText(copy.result.resigned(copy.seat.you));
    await expect(gamePage.statsRow("hard")).toContainText(copy.stats.line(0, 0, 1));
  },
);
