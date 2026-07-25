import useSWR from "swr";
import type { Item } from "@/types";

export function useIncomeItems(year: number, month: number) {
  return useSWR<Item[]>(`/api/income-items?year=${year}&month=${month}`);
}

export function useExpenseItems(year: number, month: number) {
  return useSWR<Item[]>(`/api/expense-items?year=${year}&month=${month}`);
}
