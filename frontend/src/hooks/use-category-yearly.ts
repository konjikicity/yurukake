import useSWR from "swr";
import type { CategoryYearlySummary } from "@/types";

export function useCategoryYearlySummary(year: number, type: "income" | "expense") {
  return useSWR<CategoryYearlySummary>(
    `/api/category-yearly-summary?year=${year}&type=${type}`
  );
}
