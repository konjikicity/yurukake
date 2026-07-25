import useSWR from "swr";
import type { Insights } from "@/types";

export function useInsights(year: number, month?: number) {
  const monthParam = month === undefined ? "" : `&month=${month}`;
  return useSWR<Insights>(`/api/insights?year=${year}${monthParam}`);
}
