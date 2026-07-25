import useSWR from "swr";
import type { ExpenseTemplate } from "@/types";

export function useExpenseTemplates() {
  return useSWR<ExpenseTemplate[]>("/api/expense-templates");
}
