import { toInsightMessages } from "@/lib/insights";
import type { InsightFact } from "@/types";

describe("toInsightMessages", () => {
  it("returns a gentle placeholder when there are no facts", () => {
    const messages = toInsightMessages([]);
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toContain("まだデータが少ない");
    expect(messages[0].tone).toBe("neutral");
  });

  it("praises a year-on-year decrease", () => {
    const facts: InsightFact[] = [
      {
        type: "yoy_expense",
        current: 182000,
        previous: 205000,
        diff: -23000,
        rate: -11.2,
        direction: "down",
      },
    ];
    const [message] = toInsightMessages(facts);
    expect(message.tone).toBe("good");
    expect(message.text).toContain("23,000円");
    expect(message.text).toContain("去年");
  });

  it("flags a year-on-year increase without scolding", () => {
    const facts: InsightFact[] = [
      {
        type: "yoy_expense",
        current: 205000,
        previous: 182000,
        diff: 23000,
        rate: 12.6,
        direction: "up",
      },
    ];
    const [message] = toInsightMessages(facts);
    expect(message.tone).toBe("warn");
    expect(message.text).toContain("23,000円");
  });

  it("skips comparisons that have no baseline", () => {
    const facts: InsightFact[] = [
      { type: "yoy_expense", current: 182000, previous: 0, diff: 182000, rate: null, direction: "new" },
      { type: "mom_expense", current: 182000, previous: 0, diff: 182000, rate: null, direction: "new" },
    ];
    expect(toInsightMessages(facts)).toHaveLength(1);
    expect(toInsightMessages(facts)[0].text).toContain("まだデータが少ない");
  });

  it("describes the top spending category with its share", () => {
    const facts: InsightFact[] = [
      {
        type: "top_category",
        category_id: 3,
        category_name: "食費",
        category_color: "#f48fb1",
        total: 62000,
        share: 34.1,
      },
    ];
    const [message] = toInsightMessages(facts);
    expect(message.text).toContain("食費");
    expect(message.text).toContain("34%");
    expect(message.tone).toBe("neutral");
  });

  it("maps each budget level to its own tone", () => {
    const at = (level: "safe" | "warn" | "over", rate: number) =>
      toInsightMessages([
        { type: "budget", budget: 200000, expense: 100000, rate, level },
      ])[0];

    expect(at("safe", 50).tone).toBe("good");
    expect(at("warn", 91).tone).toBe("warn");
    expect(at("warn", 91).text).toContain("91%");
    expect(at("over", 110).tone).toBe("bad");
  });

  it("compares against the monthly average in both directions", () => {
    const up = toInsightMessages([
      { type: "vs_average", current: 182000, average: 171000, diff: 11000, rate: 6.4, direction: "up" },
    ])[0];
    const down = toInsightMessages([
      { type: "vs_average", current: 160000, average: 171000, diff: -11000, rate: -6.4, direction: "down" },
    ])[0];

    expect(up.tone).toBe("warn");
    expect(down.tone).toBe("good");
    expect(up.text).toContain("いつもの月");
  });

  it("keeps the order of the facts it is given", () => {
    const facts: InsightFact[] = [
      { type: "budget", budget: 200000, expense: 220000, rate: 110, level: "over" },
      {
        type: "yoy_expense",
        current: 182000,
        previous: 205000,
        diff: -23000,
        rate: -11.2,
        direction: "down",
      },
    ];
    const messages = toInsightMessages(facts);
    expect(messages[0].tone).toBe("bad");
    expect(messages[1].tone).toBe("good");
  });
});
