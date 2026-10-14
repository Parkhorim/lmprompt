import { defineConfig, devices } from "@playwright/test";

// 빌드 결과(dist)를 미리보기 서버로 띄워 9절 수용 기준을 확인
export default defineConfig({
  testDir: "tests",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4179",
    permissions: ["clipboard-read", "clipboard-write"],
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npx vite preview --port 4179 --strictPort",
    url: "http://localhost:4179",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
