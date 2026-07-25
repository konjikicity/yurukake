import useSWR from "swr";
import type { MonthlySummary } from "@/types";

export function useSummary(year: number) {
  return useSWR<MonthlySummary[]>(`/api/summary?year=${year}`);
}
