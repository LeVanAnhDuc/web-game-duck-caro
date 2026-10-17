import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";
import { resolveEnv } from "@/config/env";
import { buildGrepInvert } from "@/config/env-guard";
import { findUrls } from "@/config/urls";

const env = resolveEnv(process.env.ENV);
const includeFull = process.env.FULL === "1";
const isDev = env === "dev";
const grepInvert = buildGrepInvert(env, includeFull);
// Page objects navigate with "./…": GitHub Pages serves the game under /web-game-duck-caro/, so the baseURL keeps
// its path and ends with "/" (a leading "/" would drop the path). undefined on an env without a host.
const webUrl = findUrls(env)?.webUrl;
const baseURL = webUrl ? `${webUrl}/` : undefined;

// Dev runs against the STATIC EXPORT of ../client, never `next dev` (ADR-0022): Next's dev overlay is a real element
// in the tab order, so a keyboard test on `next dev` measures a focus tree production does not have.
// ../client/scripts/build-e2e.mjs builds two exports one after the other (two `next build` at once would trample
// .next): out/ with the Ducker ID flag off (what Pages serves) and out-auth/ with the flag on against a fake issuer
// (ADR-0029), served on its own port for the ducker-id sign-in spec only.
const PORT = 3300;
const AUTH_PORT = 3301;
const AUTH_URL = `http://127.0.0.1:${AUTH_PORT}/`;
const prebuilt = process.env.CLIENT_PREBUILT === "1";
const build = prebuilt ? "" : "pnpm build:e2e && ";

const TOUCH = /e2e\/touch\/.*\.e2e\.ts$/;
// Every ducker-id spec but flag-off needs the flag-on export.
const SIGN_IN = /e2e\/ducker-id\/(?!flag-off\.).*\.e2e\.ts$/;

// The board keeps its own zoom; a browser zoom on top of it would move the hit-test away from the drawing.
// 1280 wide is a desktop layout (the right-hand panel shows from 1024).
const DESKTOP = { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } };

export default defineConfig({
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // "app" first: the playwright-test MCP server (agents) treats the first project as primary.
  // Variants are extra projects named "app-<variant>"; package.json runs --project="app*".
  projects: [
    {
      name: "app",
      testDir: "./src/tests",
      testMatch: [/e2e\/.*\.e2e\.ts$/, /api\/.*\.api\.ts$/, /seed\.spec\.ts$/],
      testIgnore: [TOUCH, SIGN_IN],
      grepInvert,
      use: { ...DESKTOP, baseURL },
    },
    // A real touch screen: a tap previews and a second tap commits only when pointerType is "touch" (ADR-0007).
    {
      name: "app-touch",
      testDir: "./src/tests",
      testMatch: TOUCH,
      grepInvert,
      use: { ...devices["Pixel 5"], baseURL },
    },
    // Ducker ID sign-in against the flag-on export. Only dev has one: the deployed build ships with the flag off.
    ...(isDev
      ? [
          {
            name: "app-auth",
            testDir: "./src/tests",
            testMatch: SIGN_IN,
            grepInvert,
            use: { ...DESKTOP, baseURL: AUTH_URL },
          },
        ]
      : []),
    // One-off data setup (pnpm provision), never part of a normal run.
    {
      name: "provision",
      testDir: "./src/tests/setup",
      testMatch: /.*\.setup\.ts$/,
      workers: 1,
      use: { baseURL },
    },
    { name: "unit", testDir: "./src", testMatch: /.*\.test\.ts$/ },
  ],
  // Boots the game itself on dev (builds both exports first unless CLIENT_PREBUILT=1). The auth server is started
  // after the first one is up, i.e. after the chained build has written ../client/out-auth.
  webServer:
    isDev && !process.argv.includes("--project=unit")
      ? [
          {
            command: `cd ../client && ${build}node scripts/serve-out.mjs ${PORT} out`,
            url: `http://127.0.0.1:${PORT}/`,
            reuseExistingServer: !process.env.CI,
            timeout: 600_000,
          },
          {
            command: `node ../client/scripts/serve-out.mjs ${AUTH_PORT} ../client/out-auth`,
            url: AUTH_URL,
            reuseExistingServer: !process.env.CI,
            timeout: 60_000,
          },
        ]
      : undefined,
});
