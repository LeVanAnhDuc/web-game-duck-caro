import { test as core } from "./core.fixture";
import { GamePage } from "@/pages/game.page";

// One fixture per page object, named like the class in camelCase (GamePage → gamePage).
export const test = core.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => use(new GamePage(page)),
});
