export type BudgetLevel = "none" | "safe" | "warn" | "over";

export type BudgetStatus = {
  percent: number;
  remaining: number;
  over: number;
  level: BudgetLevel;
};

const WARN_THRESHOLD = 80;

export function budgetStatus(expense: number, budget: number | null | undefined): BudgetStatus {
  if (!budget || budget <= 0) {
    return { percent: 0, remaining: 0, over: 0, level: "none" };
  }

  const ratio = (expense / budget) * 100;
  const percent = Math.round(ratio);
  const remaining = Math.max(0, budget - expense);
  const over = Math.max(0, expense - budget);
  const level: BudgetLevel = expense >= budget ? "over" : ratio >= WARN_THRESHOLD ? "warn" : "safe";

  return { percent, remaining, over, level };
}
