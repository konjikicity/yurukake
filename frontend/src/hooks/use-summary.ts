import useSWR from "swr";
import type { MonthlySummary } from "@/types";

export function useSummary(year: number | null) {
  return useSWR<MonthlySummary[]>(year == null ? null : `/api/summary?year=${year}`);
}
