"use client";

import { useState } from "react";
import { useSummary } from "@/hooks/use-summary";
import YearSelector from "@/components/YearSelector";
import CurrentMonthCard from "@/components/CurrentMonthCard";
import MonthCard from "@/components/MonthCard";
import YearChart from "@/components/YearChart";

export default function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: summary, isLoading } = useSummary(year);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-muted-foreground">よみこみちゅう...</p>
      </div>
    );
  }

  const currentMonthData = summary?.find((s) => s.month === currentMonth);
  const otherMonths = summary?.filter((s) => s.month !== currentMonth) ?? [];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">ダッシュボード</h2>
        <YearSelector year={year} onChange={setYear} />
      </div>

      {currentMonthData && (
        <div className="mb-8">
          <CurrentMonthCard
            year={year}
            month={currentMonth}
            income={currentMonthData.income}
            expense={currentMonthData.expense}
            balance={currentMonthData.balance}
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherMonths.map((s) => (
          <MonthCard
            key={s.month}
            year={year}
            month={s.month}
            income={s.income}
            expense={s.expense}
            balance={s.balance}
            prevIncome={s.prev_income}
            prevExpense={s.prev_expense}
          />
        ))}
      </div>

      {summary && (
        <div className="mt-8">
          <YearChart data={summary} />
        </div>
      )}
    </div>
  );
}
