import useSWR from "swr";
import api from "@/lib/api";
import type { SavingsGoal } from "@/types";

const fetcher = (url: string) =>
  api.get(url).then((res) => {
    const data = res.data;
    if (!data || typeof data !== "object" || !("type" in data)) return null;
    return data as SavingsGoal;
  });

export function useSavingsGoal() {
  return useSWR<SavingsGoal | null>("/api/savings-goal", fetcher);
}
