import useSWR from "swr";
import api from "@/lib/api";
import type { MonthlySummary } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useSummary(year: number) {
  return useSWR<MonthlySummary[]>(`/api/summary?year=${year}`, fetcher);
}
