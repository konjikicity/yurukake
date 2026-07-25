import { budgetStatus } from "@/lib/budget";

describe("budgetStatus", () => {
  it("reports 'none' when no budget is set", () => {
    expect(budgetStatus(120000, null)).toEqual({
      percent: 0,
      remaining: 0,
      over: 0,
      level: "none",
    });
    expect(budgetStatus(120000, undefined).level).toBe("none");
  });

  it("treats a zero budget as unset to avoid dividing by zero", () => {
    const s = budgetStatus(120000, 0);
    expect(s.level).toBe("none");
    expect(Number.isFinite(s.percent)).toBe(true);
  });

  it("reports 'safe' below the warning threshold", () => {
    const s = budgetStatus(80000, 160000);
    expect(s.percent).toBe(50);
    expect(s.remaining).toBe(80000);
    expect(s.over).toBe(0);
    expect(s.level).toBe("safe");
  });

  it("reports 'warn' from 80% up to the budget", () => {
    expect(budgetStatus(128000, 160000).level).toBe("warn");
    expect(budgetStatus(159999, 160000).level).toBe("warn");
    expect(budgetStatus(127999, 160000).level).toBe("safe");
  });

  it("reports 'over' once spending reaches the budget", () => {
    const s = budgetStatus(176000, 160000);
    expect(s.percent).toBe(110);
    expect(s.remaining).toBe(0);
    expect(s.over).toBe(16000);
    expect(s.level).toBe("over");
    expect(budgetStatus(160000, 160000).level).toBe("over");
  });

  it("rounds the percentage to a whole number", () => {
    expect(budgetStatus(33333, 100000).percent).toBe(33);
  });

  it("handles zero spending", () => {
    expect(budgetStatus(0, 160000)).toEqual({
      percent: 0,
      remaining: 160000,
      over: 0,
      level: "safe",
    });
  });
});
