import { describe, it, expect } from "vitest";
import data from "../src/data/styles.json";
import subjects from "../src/data/subjects.json";
import { withStyle, styleGroups, styleLine } from "../src/lib/styles.js";

describe("styles.json", () => {
  it("49종, 번호 1~49, id 중복 없음", () => {
    expect(data.styles).toHaveLength(49);
    expect(data.styles.map((s) => s.no)).toEqual(Array.from({ length: 49 }, (_, i) => i + 1));
    expect(new Set(data.styles.map((s) => s.id)).size).toBe(49);
  });
  it("모든 스타일이 있는 분류·교과 묶음을 씀", () => {
    const cats = data.categories.map((c) => c.id);
    const groups = Object.keys(subjects.groups);
    for (const s of data.styles) {
      expect(cats, s.id).toContain(s.cat);
      for (const g of s.for) expect(groups, s.id).toContain(g);
      expect(s.text.length).toBeGreaterThan(10);
    }
  });
  it("교과 묶음마다 추천이 있음", () => {
    for (const g of Object.keys(subjects.groups)) expect(data.styles.some((s) => s.for.includes(g)), g).toBe(true);
  });
});

describe("withStyle / styleGroups", () => {
  it("고르면 빈 줄 뒤에 붙고, 안 고르면 그대로", () => {
    expect(withStyle("본문", "chalkboard")).toBe("본문\n\n" + styleLine("chalkboard"));
    expect(styleLine("chalkboard").startsWith("디자인 스타일: ")).toBe(true);
    expect(withStyle("본문", "")).toBe("본문");
    expect(withStyle("본문", "없는-id")).toBe("본문");
  });
  it("교과 추천 묶음이 맨 앞", () => {
    const gs = styleGroups("sci", "과학");
    expect(gs[0].label).toBe("과학 추천");
    expect(gs.slice(1).reduce((n, g) => n + g.styles.length, 0)).toBe(49);
    expect(styleGroups("", "과학")[0].id).toBe("learn");
  });
});
