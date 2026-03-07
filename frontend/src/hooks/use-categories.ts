import useSWR from "swr";
import api from "@/lib/api";
import type { Category, CategorySummary } from "@/types";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useCategories(type?: "income" | "expense") {
  const params = type ? `?type=${type}` : "";
  return useSWR<Category[]>(`/api/categories${params}`, fetcher);
}

export function useCategorySummary(year: number, month: number, type: "income" | "expense") {
  return useSWR<CategorySummary[]>(
    `/api/category-summary?year=${year}&month=${month}&type=${type}`,
    fetcher
  );
}
