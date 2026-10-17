import { expect, test } from "@/fixtures";
import { copy } from "@/data/copy";

test.beforeEach(async ({ gamePage }) => {
  await gamePage.goto();
});

test(
  "máy đáp lại nước của người chơi bằng Worker thật",
  { tag: ["@TC-OPPONENT-001", "@smoke"] },
  async ({ gamePage }) => {
    // The one test no unit test can replace: every engine unit test injects a fake engine, so only this proves
    // engine.worker.ts starts and answers in a real browser.
    await gamePage.startGame();
    await gamePage.playAt(0, 0);
    await expect(gamePage.moveRows()).toHaveCount(2);

    const [first, reply] = await gamePage.moves();
    expect(first).toEqual([0, 0]);
    await expect(gamePage.notice()).toHaveText(copy.notice.aiPlacedAt(reply![0], reply![1]));
  },
);

test(
  "chọn Máy đi trước thì máy tự đánh nước đầu ở 0, 0",
  { tag: ["@TC-OPPONENT-002", "@smoke"] },
  async ({ gamePage }) => {
    await gamePage.startGame({ first: "two" });
    await expect(gamePage.moveRows()).toHaveCount(1);
    expect(await gamePage.moves()).toEqual([[0, 0]]);
    await expect(gamePage.notice()).toHaveText(copy.notice.aiPlacedAt(0, 0));
  },
);

for (const level of ["easy", "normal", "hard"] as const) {
  test(
    `mỗi mức khó: header ghi đúng mức và máy trả lời — ${copy.level[level]}`,
    { tag: ["@TC-OPPONENT-003"] },
    async ({ gamePage }) => {
      await gamePage.startGame({ level });
      await expect(gamePage.badge()).toHaveText(copy.level[level]);
      await gamePage.playAt(0, 0);
      // Hard is budgeted 1.5s and measured over it on slow machines (NFR-PERF-06): wait on state, not on time.
      await expect(gamePage.moveRows()).toHaveCount(2, { timeout: 15_000 });
    },
  );
}

test(
  "màn bắt đầu chọn sẵn mức Thường khi chưa cài đặt gì",
  { tag: ["@TC-OPPONENT-004"] },
  async ({ gamePage }) => {
    await expect(gamePage.levelOption("normal")).toHaveAttribute("aria-pressed", "true");
    await expect(gamePage.levelOption("easy")).toHaveAttribute("aria-pressed", "false");
    await expect(gamePage.levelOption("hard")).toHaveAttribute("aria-pressed", "false");
  },
);
