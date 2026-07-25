import useSWR from "swr";
import type { Category, CategorySummary } from "@/types";

export function useCategories(type?: "income" | "expense") {
  const params = type ? `?type=${type}` : "";
  return useSWR<Category[]>(`/api/categories${params}`);
}

export function useCategorySummary(year: number, month: number, type: "income" | "expense") {
  return useSWR<CategorySummary[]>(
    `/api/category-summary?year=${year}&month=${month}&type=${type}`
  );
}
