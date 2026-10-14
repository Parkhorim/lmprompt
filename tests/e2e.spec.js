// PRD 9절 수용 기준
import { test, expect } from "@playwright/test";

const card = (page, id) => page.locator(`[data-card="${id}"]`);
const slot = (page, id, key) => card(page, id).locator(`.slot input[placeholder="[${key}]"]`);
const readClipboard = (page) => page.evaluate(() => navigator.clipboard.readText());

let errors;
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("1. 첫 화면 기본값과 카드 20장", async ({ page }) => {
  await expect(page.locator("#set-grade")).toHaveValue("중학교 2학년");
  await expect(page.locator("#set-subject")).toHaveValue("과학");
  await expect(page.locator("#set-unit")).toHaveValue("물질의 구성");
  await expect(page.locator("#set-unit-list")).toHaveValue("물질의 구성");
  await expect(page.locator(".card")).toHaveCount(20);
  await expect(page.locator(".sticky-summary")).toHaveText("중학교 2학년 · 과학 · 물질의 구성");
});

test("2. 교과 버튼: 강조·단원 목록·{교과} 슬롯·예시 묶음", async ({ page }) => {
  await page.getByRole("button", { name: "국어", exact: true }).click();
  await expect(page.getByRole("button", { name: "국어", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "과학", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#set-subject")).toHaveValue("국어");
  await expect(page.locator("#set-unit-list optgroup")).toHaveAttribute("label", "2022 개정 국어 영역");
  await expect(page.locator("#set-unit-list option").first()).toHaveText("영역·주제 고르기");
  for (const id of ["guide", "plan", "sim"]) await expect(slot(page, id, "교과")).toHaveValue("국어");
  const ex = card(page, "mindmap").locator(".fold-example");
  await expect(ex.locator("summary")).toHaveText("국어 예시 프롬프트");
  await expect(ex.locator(".line-text")).toContainText("인물 관계와 갈등 구조");
});

test("3. 학년별 수학·과학 단원과 중3 안내", async ({ page }) => {
  await page.getByRole("button", { name: "수학", exact: true }).click();
  await page.locator("#set-grade").selectOption("중학교 1학년");
  await expect(page.locator("#set-unit-list optgroup").first()).toHaveAttribute("label", "1학년 1학기");
  await expect(page.locator(".unit-note3")).toHaveCount(0);
  await page.locator("#set-grade").selectOption("중학교 3학년");
  await expect(page.locator("#set-unit-list optgroup").first()).toHaveAttribute("label", "3학년 1학기");
  await expect(page.locator(".unit-note3")).toHaveText("2026학년도 중3은 2015 개정 교과서 단원입니다");
  await page.locator("#set-grade").selectOption("");
  await expect(page.locator("#set-unit-list option").first()).toHaveText("학년을 먼저 고르세요");
});

test("4. 단원 목록 선택 → 직접 입력 칸과 모든 {단원} 슬롯", async ({ page }) => {
  await page.locator("#set-unit-list").selectOption("별과 우주");
  await expect(page.locator("#set-unit")).toHaveValue("별과 우주");
  const unitSlots = page.locator('.card .slot input[placeholder="[단원]"]');
  const n = await unitSlots.count();
  expect(n).toBeGreaterThan(10);
  for (let i = 0; i < n; i++) await expect(unitSlots.nth(i)).toHaveValue("별과 우주");
});

test("5. 카드 안 전역 슬롯 → 설정 패널과 다른 카드", async ({ page }) => {
  await slot(page, "guide", "교과").fill("영어");
  await expect(page.locator("#set-subject")).toHaveValue("영어");
  await expect(slot(page, "sim", "교과")).toHaveValue("영어");
  await expect(page.getByRole("button", { name: "영어", exact: true })).toHaveAttribute("aria-pressed", "true");
  await slot(page, "summary", "학년").fill("중학교 3학년");
  await expect(page.locator("#set-grade")).toHaveValue("중학교 3학년");
});

test("6. 지역 슬롯은 그 카드에만, 새로고침 후에도 유지", async ({ page }) => {
  await slot(page, "quiz", "개수").fill("15");
  await expect(slot(page, "flash", "개수")).toHaveValue("20");
  await page.reload();
  await expect(slot(page, "quiz", "개수")).toHaveValue("15");
  await expect(slot(page, "flash", "개수")).toHaveValue("20");
});

test("7. 복사 결과에 태그 없음, 빈 슬롯은 [키]", async ({ page }) => {
  await card(page, "summary").getByRole("button", { name: "핵심 개념 요약 프롬프트 복사" }).click();
  let text = await readClipboard(page);
  expect(text).toBe("이 단원의 핵심 개념을 중학교 2학년 눈높이로 5개 이내로 요약해 줘. 개념마다 근거가 된 소스 위치를 인용 번호로 표시해 줘.");
  await expect(page.locator(".toast")).toHaveText("복사했어요. 노트북에 붙여 넣으세요");
  await expect(card(page, "summary").locator(".btn-primary")).toHaveText("복사됨");

  await slot(page, "summary", "개수").fill("");
  await page.locator("#set-grade").selectOption("");
  await card(page, "summary").locator(".btn-primary").click();
  text = await readClipboard(page);
  expect(text).toContain("[학년] 눈높이로 [개수]개");
  expect(text).not.toMatch(/<[^>]+>/);

  await card(page, "guide").locator(".btn-primary").click();
  text = await readClipboard(page);
  expect(text.split("\n")).toHaveLength(4);
});

test("8. 문장 직접 고치기 → 새로고침 유지 → 원래 문장으로", async ({ page }) => {
  const c = card(page, "audio");
  await c.getByRole("button", { name: "문장 직접 고치기" }).click();
  const ta = c.locator("textarea");
  await expect(ta).toHaveValue(/결석한 중학교 2학년 학생/);
  await ta.fill("직접 쓴 문장");
  await expect(c.locator(".edited-flag")).toHaveText("직접 고친 문장 사용 중");
  await page.reload();
  await expect(c.locator("textarea")).toHaveValue("직접 쓴 문장");
  await c.locator(".btn-primary").click();
  expect(await readClipboard(page)).toBe("직접 쓴 문장");
  await c.getByRole("button", { name: "원래 문장으로" }).click();
  await expect(c.locator("textarea")).toHaveCount(0);
  await expect(c.locator(".edited-flag")).toHaveCount(0);
});

test("9. 완료 체크 개수 = 완료 n / 20", async ({ page }) => {
  for (const id of ["summary", "quiz", "meta"]) await card(page, id).getByLabel("완료").check();
  await expect(page.locator(".sticky-done")).toHaveText("완료 3 / 20");
  await expect(card(page, "quiz")).toHaveClass(/is-done/);
  await card(page, "quiz").getByLabel("완료").uncheck();
  await expect(page.locator(".sticky-done")).toHaveText("완료 2 / 20");
});

test("10. 입력한 내용 모두 지우기(확인 단계)", async ({ page }) => {
  await card(page, "summary").getByLabel("완료").check();
  await slot(page, "quiz", "개수").fill("15");
  await page.getByRole("button", { name: "입력한 내용 모두 지우기" }).click();
  await page.getByRole("button", { name: "취소" }).click();
  await expect(page.locator("#set-subject")).toHaveValue("과학");
  await page.getByRole("button", { name: "입력한 내용 모두 지우기" }).click();
  await page.getByRole("button", { name: "지우기", exact: true }).click();
  await expect(page.locator("#set-grade")).toHaveValue("");
  await expect(page.locator("#set-subject")).toHaveValue("");
  await expect(page.locator("#set-unit")).toHaveValue("");
  await expect(page.locator(".sticky-summary")).toHaveText("내 수업 정보를 입력하세요");
  await expect(page.locator(".sticky-done")).toHaveText("완료 0 / 20");
  await expect(slot(page, "quiz", "개수")).toHaveValue("10");
  await expect(page.locator("#set-unit-list option").first()).toHaveText("교과를 먼저 고르세요");
  await expect(card(page, "mindmap").locator(".fold-example summary")).toHaveText("교과를 고르면 바뀜 · 과학 예시 프롬프트");
});

test("11. 390px 가로 스크롤 없음, 라이트·다크 색", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  for (const d of await page.locator("details").all()) await d.evaluate((el) => (el.open = true));
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/mobile-light.png", fullPage: false });

  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.emulateMedia({ colorScheme: "light" });
  expect(await bg()).toBe("rgb(244, 246, 247)");
  await page.emulateMedia({ colorScheme: "dark" });
  expect(await bg()).toBe("rgb(15, 23, 25)");
  expect(await page.evaluate(() => getComputedStyle(document.body).color)).toBe("rgb(228, 236, 238)");
  await page.screenshot({ path: "test-results/mobile-dark.png", fullPage: false });
  // data-theme 속성으로도 바뀜
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  expect(await bg()).toBe("rgb(244, 246, 247)");
});

test("12. 콘솔 오류 없음", async ({ page }) => {
  await page.getByRole("button", { name: "체육", exact: true }).click();
  await page.locator("#set-unit-list").selectOption("스포츠");
  await card(page, "sim").locator(".btn-primary").click();
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});

test("디자인 스타일: 고르기 → 본문·복사·새로고침·직접 고치기", async ({ page }) => {
  const c = card(page, "slides");
  const sel = c.getByLabel("디자인 스타일");
  await expect(sel.locator("optgroup").first()).toHaveAttribute("label", "과학 추천");
  await expect(sel.locator("option")).toHaveCount(1 + 49 + (await sel.locator('optgroup[label="과학 추천"] option').count()));
  await sel.selectOption("chalkboard");
  await expect(c.locator(".style-line")).toContainText("디자인 스타일: 짙은 녹색 칠판");
  await c.locator(".btn-primary").click();
  const text = await readClipboard(page);
  expect(text).toMatch(/정리 질문 슬라이드를 넣어 줘\.\r?\n\r?\n디자인 스타일: 짙은 녹색 칠판/);
  await expect(card(page, "webtoon").locator(".style-line")).toHaveCount(0);
  await page.reload();
  await expect(c.getByLabel("디자인 스타일")).toHaveValue("chalkboard");
  await c.getByRole("button", { name: "문장 직접 고치기" }).click();
  await expect(c.locator("textarea")).toHaveValue(/디자인 스타일: 짙은 녹색 칠판/);
  await c.getByRole("button", { name: "원래 문장으로" }).click();
  await c.getByLabel("디자인 스타일").selectOption("dark-mode");
  await expect(c.locator(".style-caution")).toContainText("프로젝터");
  await c.getByLabel("디자인 스타일").selectOption("");
  await expect(c.locator(".style-line")).toHaveCount(0);
});
