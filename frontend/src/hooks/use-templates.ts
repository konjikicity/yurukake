import useSWR from "swr";
import api from "@/lib/api";
import type { ExpenseTemplate } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useExpenseTemplates() {
  return useSWR<ExpenseTemplate[]>("/api/expense-templates", fetcher);
}
