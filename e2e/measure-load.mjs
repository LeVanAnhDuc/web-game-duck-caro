// Đo lần tải đầu trên mạng 4G mô phỏng — NFR-PERF-09.
//
// Chạy:  node e2e/measure-load.mjs            (cần `yarn build` và server ở :3300)
//        node e2e/measure-load.mjs --runs 5
//        node e2e/measure-load.mjs --url http://127.0.0.1:3300/
//
// Vì sao là một script trong repo chứ không phải một lần bấm tay trong DevTools: ngưỡng
// của NFR-PERF-09 được chốt TỪ con số này, nên con số phải đo lại được. Một số đo không
// lặp lại được thì không đỡ nổi một ngưỡng.
//
// Cấu hình throttling lấy đúng preset "Slow 4G" mà Lighthouse dùng cho mobile, cộng
// CPU chậm 4 lần — vì `overview.md` §3 nói nhóm người dùng chính chơi trên điện thoại.
import { chromium } from '@playwright/test';

// Cùng lý do như `serve-out.mjs`: không đọc biến môi trường ở dự án này.
const urlFlag = process.argv.indexOf('--url');
const URL = urlFlag === -1 ? 'http://127.0.0.1:3300/' : process.argv[urlFlag + 1];
const RUNS = Number(process.argv[process.argv.indexOf('--runs') + 1]) || 3;

/** Preset "Slow 4G" của Lighthouse. */
const SLOW_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};
const CPU_SLOWDOWN = 4;

async function once() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');

  /*
   * Đếm byte bằng CDP `Network.loadingFinished`, KHÔNG bằng header `content-length`.
   * Cách dùng header phụ thuộc vào server có gửi header đó hay không, và khi nó không
   * gửi thì phép đo trả về 0 — một con số sai trông y như một con số đúng.
   */
  let transferred = 0;
  cdp.on('Network.loadingFinished', (event) => {
    transferred += event.encodedDataLength ?? 0;
  });
  await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });

  await page.goto(URL, { waitUntil: 'load' });

  const metrics = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const nav = performance.getEntriesByType('navigation')[0];
        let lcp = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) lcp = entry.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        const paint = performance
          .getEntriesByType('paint')
          .find((p) => p.name === 'first-contentful-paint');
        // Chờ một nhịp để LCP kịp chốt sau khi `load` bắn.
        setTimeout(() => {
          resolve({
            fcp: Math.round(paint?.startTime ?? 0),
            lcp: Math.round(lcp),
            domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0),
            load: Math.round(nav?.loadEventEnd ?? 0),
          });
        }, 1200);
      }),
  );

  // Bàn phải vẽ được và chơi được, không chỉ "trang đã load".
  await page.locator('canvas').waitFor({ state: 'visible' });
  const playable = await page
    .getByRole('button', { name: 'Bắt đầu ván mới' })
    .isVisible();

  await browser.close();
  return { ...metrics, transferredKB: Math.round(transferred / 1024), playable };
}

const results = [];
for (let i = 0; i < RUNS; i += 1) results.push(await once());

const median = (key) => {
  const sorted = results.map((r) => r[key]).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

console.log(`URL: ${URL}`);
console.log(`Slow 4G (1.6 Mbps / 150ms RTT) + CPU x${CPU_SLOWDOWN}, viewport 412x915`);
console.log(`${RUNS} lan chay:`);
for (const r of results) console.log('  ', JSON.stringify(r));
console.log('TRUNG VI:');
for (const key of ['fcp', 'lcp', 'domContentLoaded', 'load', 'transferredKB']) {
  console.log(`   ${key}: ${median(key)}`);
}
console.log(`   playable moi lan: ${results.every((r) => r.playable)}`);
