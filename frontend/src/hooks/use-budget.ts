import useSWR from "swr";
import api from "@/lib/api";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useBudget(year: number, month: number) {
  return useSWR<{ amount: number | null }>(
    `/api/monthly-budgets?year=${year}&month=${month}`,
    fetcher
  );
}
