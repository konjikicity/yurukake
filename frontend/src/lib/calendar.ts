import type { MonthlySummary } from "@/types";

export function adjacentMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function splitMonths(summary: MonthlySummary[] | undefined, year: number, today: Date) {
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;
  const months = summary ?? [];

  if (year !== thisYear) {
    return { current: undefined, others: year < thisYear ? months : [] };
  }

  return {
    current: months.find((s) => s.month === thisMonth),
    others: months.filter((s) => s.month < thisMonth),
  };
}
