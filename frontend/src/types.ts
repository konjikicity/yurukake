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
  total: number;
};
