import useSWR from "swr";
import api from "@/lib/api";
import type { Item } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useIncomeItems(year: number, month: number) {
  return useSWR<Item[]>(
    `/api/income-items?year=${year}&month=${month}`,
    fetcher
  );
}

export function useExpenseItems(year: number, month: number) {
  return useSWR<Item[]>(
    `/api/expense-items?year=${year}&month=${month}`,
    fetcher
  );
}
