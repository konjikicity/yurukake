"use client";

import { useState } from "react";
import { useSummary } from "@/hooks/use-summary";
import { useCategoryYearlySummary } from "@/hooks/use-category-yearly";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryYearChart from "@/components/CategoryYearChart";
import YearSelector from "@/components/YearSelector";
import CurrentMonthCard from "@/components/CurrentMonthCard";
import MonthCard from "@/components/MonthCard";
import YearChart from "@/components/YearChart";
import SavingsProgress from "@/components/SavingsProgress";
import InsightCard from "@/components/InsightCard";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: summary, isLoading } = useSummary(year);
  const { data: expenseYearly, isLoading: expenseLoading } = useCategoryYearlySummary(year, "expense");
  const { data: incomeYearly, isLoading: incomeLoading } = useCategoryYearlySummary(year, "income");

  if (isLoading) {
    return <DashboardLoading />;
  }

  const currentMonthData = summary?.find((s) => s.month === currentMonth);
  const otherMonths = summary?.filter((s) => s.month !== currentMonth) ?? [];
  const yearIncome = summary?.reduce((s, m) => s + m.income, 0) ?? 0;
  const yearBalance = summary?.reduce((s, m) => s + m.balance, 0) ?? 0;

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
            budget={currentMonthData.budget}
          />
        </div>
      )}

      <div className="grid gap-4 mb-8 md:grid-cols-2">
        <SavingsProgress mode="yearly" income={yearIncome} balance={yearBalance} />
        <InsightCard year={year} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {otherMonths.map((s) => (
          <MonthCard
            key={s.month}
            year={year}
            month={s.month}
            income={s.income}
            expense={s.expense}
            balance={s.balance}
            budget={s.budget}
            prevIncome={s.prev_income}
            prevExpense={s.prev_expense}
          />
        ))}
      </div>

      <div className="mt-8">
        <Tabs defaultValue="balance">
          <TabsList className="mb-4">
            <TabsTrigger value="balance">収支</TabsTrigger>
            <TabsTrigger value="expense">支出カテゴリー</TabsTrigger>
            <TabsTrigger value="income">収入カテゴリー</TabsTrigger>
          </TabsList>

          <TabsContent value="balance">{summary && <YearChart data={summary} />}</TabsContent>
          <TabsContent value="expense">
            <CategoryYearChart data={expenseYearly} isLoading={expenseLoading} />
          </TabsContent>
          <TabsContent value="income">
            <CategoryYearChart data={incomeYearly} isLoading={incomeLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
