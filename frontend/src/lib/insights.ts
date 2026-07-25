import type { ComparisonFact, InsightFact } from "@/types";

export type InsightTone = "good" | "warn" | "bad" | "neutral";

export type InsightMessage = {
  icon: string;
  tone: InsightTone;
  text: string;
};

const EMPTY: InsightMessage = {
  icon: "🌱",
  tone: "neutral",
  text: "まだデータが少ないので、たまったら教えますね。",
};

const yen = (n: number) => `${Math.abs(n).toLocaleString()}円`;
const pct = (n: number | null) => `${Math.abs(Math.round(n ?? 0))}%`;

function comparison(fact: ComparisonFact): InsightMessage | null {
  if (fact.direction === "new" || fact.direction === "flat") return null;

  const down = fact.direction === "down";

  if (fact.type === "yoy_expense") {
    return {
      icon: down ? "🎉" : "📈",
      tone: down ? "good" : "warn",
      text: down
        ? `去年の同じ時期より ${yen(fact.diff)} おさえられてます。えらい。`
        : `去年の同じ時期より ${yen(fact.diff)} 多めです。`,
    };
  }

  if (fact.type === "mom_expense") {
    return {
      icon: down ? "👏" : "📊",
      tone: down ? "good" : "warn",
      text: down
        ? `先月より ${yen(fact.diff)} 少なく済んでます。`
        : `先月より ${yen(fact.diff)} 増えてます。`,
    };
  }

  return {
    icon: down ? "🍀" : "👀",
    tone: down ? "good" : "warn",
    text: down
      ? `いつもの月より ${yen(fact.diff)} 控えめです。`
      : `いつもの月より ${yen(fact.diff)} 多めです。`,
  };
}

function toMessage(fact: InsightFact): InsightMessage | null {
  switch (fact.type) {
    case "yoy_expense":
    case "mom_expense":
    case "vs_average":
      return comparison(fact);

    case "top_category":
      return {
        icon: "🥇",
        tone: "neutral",
        text: `いちばん使ってるのは「${fact.category_name}」で ${yen(fact.total)}（全体の${pct(fact.share)}）。`,
      };

    case "budget":
      if (fact.level === "over") {
        return {
          icon: "🚨",
          tone: "bad",
          text: `予算を ${yen(fact.expense - fact.budget)} こえています。`,
        };
      }
      if (fact.level === "warn") {
        return {
          icon: "⏳",
          tone: "warn",
          text: `予算の ${pct(fact.rate)} をつかいました。ラストはゆるっといきましょ。`,
        };
      }
      return {
        icon: "😊",
        tone: "good",
        text: `予算の ${pct(fact.rate)} でおさまってます。いいペースです。`,
      };

    default:
      return null;
  }
}

export function toInsightMessages(facts: InsightFact[]): InsightMessage[] {
  const messages = facts
    .map(toMessage)
    .filter((m): m is InsightMessage => m !== null);

  return messages.length > 0 ? messages : [EMPTY];
}
