import useSWR from "swr";

export function useBudget(year: number, month: number) {
  return useSWR<{ amount: number | null }>(`/api/monthly-budgets?year=${year}&month=${month}`);
}
