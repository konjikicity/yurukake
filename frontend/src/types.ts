export type Item = {
  id: number;
  user_id: number;
  year: number;
  month: number;
  name: string;
  amount: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
};

export type ExpenseTemplate = {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
};

export type MonthlySummary = {
  month: number;
  income: number;
  expense: number;
  balance: number;
  budget: number | null;
  prev_income: number;
  prev_expense: number;
};

export type Category = {
  id: number;
  user_id: number;
  type: "income" | "expense";
  name: string;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type CategorySummary = {
  category_id: number | null;
  category_name: string;
  category_color?: string | null;
  total: number;
};

export type CategorySeries = {
  key: string;
  name: string;
  color: string | null;
  total: number;
};

export type CategoryMonthRow = {
  month: number;
  total: number;
} & Record<string, number>;

export type CategoryYearlySummary = {
  series: CategorySeries[];
  data: CategoryMonthRow[];
};

export type ComparisonDirection = "up" | "down" | "flat" | "new";

export type ComparisonFact = {
  type: "yoy_expense" | "mom_expense" | "vs_average";
  current: number;
  previous?: number;
  average?: number;
  diff: number;
  rate: number | null;
  direction: ComparisonDirection;
};

export type TopCategoryFact = {
  type: "top_category";
  category_id: number | null;
  category_name: string;
  category_color: string | null;
  total: number;
  share: number;
};

export type BudgetFact = {
  type: "budget";
  budget: number;
  expense: number;
  rate: number;
  level: "safe" | "warn" | "over";
};

export type InsightFact = ComparisonFact | TopCategoryFact | BudgetFact;

export type Insights = {
  year: number;
  month: number | null;
  facts: InsightFact[];
};

export type SavingsGoal = {
  id: number;
  user_id: number;
  type: "fixed" | "ratio";
  amount: number | null;
  percentage: number | null;
  created_at: string;
  updated_at: string;
};
