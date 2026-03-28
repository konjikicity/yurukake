"use client";

import { use } from "react";
import Link from "next/link";
import { useIncomeItems, useExpenseItems } from "@/hooks/use-items";
import { useCategorySummary } from "@/hooks/use-categories";
import IncomeSection from "@/components/IncomeSection";
import ExpenseSection from "@/components/ExpenseSection";
import SummaryBar from "@/components/SummaryBar";
import ApplyTemplatesButton from "@/components/ApplyTemplatesButton";
import CategoryPieChart from "@/components/CategoryPieChart";
import api from "@/lib/api";

type Props = {
  params: Promise<{ year: string; month: string }>;
};

export default function MonthDetailPage({ params }: Props) {
  const { year: yearStr, month: monthStr } = use(params);
  const year = Number(yearStr);
  const month = Number(monthStr);
  const { data: incomeItems } = useIncomeItems(year, month);
  const { data: expenseItems, mutate: mutateExpense } = useExpenseItems(year, month);
  const { data: expenseSummary } = useCategorySummary(year, month, "expense");
  const { data: incomeSummary } = useCategorySummary(year, month, "income");
  const totalIncome = incomeItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const totalExpense = expenseItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0;

  const handleApplyTemplates = async () => {
    await api.post("/api/expense-templates/apply", { year, month });
    mutateExpense();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-primary hover:underline text-sm">
            ダッシュボードへ戻る
          </Link>
          <h2 className="text-2xl font-bold text-foreground">
            {year}年{month}月
          </h2>
        </div>
        <ApplyTemplatesButton onApply={handleApplyTemplates} />
      </div>

      <div className="mb-8">
        <SummaryBar income={totalIncome} expense={totalExpense} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <IncomeSection year={year} month={month} />
        <ExpenseSection year={year} month={month} />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {incomeSummary && incomeSummary.length > 0 && (
          <CategoryPieChart data={incomeSummary} title="収入カテゴリー" />
        )}
        {expenseSummary && (
          <CategoryPieChart data={expenseSummary} title="支出カテゴリー" />
        )}
      </div>
    </div>
  );
}
