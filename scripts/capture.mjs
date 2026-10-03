import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL,
});
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 70));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `artifacts/site-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `artifacts/hero-${width}.png` });
    const overflowing = await page.locator("body *").evaluateAll((items) =>
      items
        .filter((item) => {
          const rect = item.getBoundingClientRect();
          return (
            rect.width > 0 &&
            (rect.right > innerWidth + 1 || rect.left < -1) &&
            !["DIALOG", "SVG", "path"].includes(item.tagName)
          );
        })
        .map((item) => ({ tag: item.tagName, class: item.className })),
    );
    console.log(width, JSON.stringify(overflowing));
  }
} finally {
  await browser.close();
}
