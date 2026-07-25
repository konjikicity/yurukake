"use client";

import { use, useState } from "react";
import Link from "next/link";
import { mutate as globalMutate } from "swr";
import { useIncomeItems, useExpenseItems } from "@/hooks/use-items";
import { useCategorySummary } from "@/hooks/use-categories";
import { useBudget } from "@/hooks/use-budget";
import IncomeSection from "@/components/IncomeSection";
import ExpenseSection from "@/components/ExpenseSection";
import SummaryBar from "@/components/SummaryBar";
import ApplyTemplatesButton from "@/components/ApplyTemplatesButton";
import CategoryPieChart from "@/components/CategoryPieChart";
import SavingsProgress from "@/components/SavingsProgress";
import BudgetProgress from "@/components/BudgetProgress";
import BudgetDialog from "@/components/BudgetDialog";
import InsightCard from "@/components/InsightCard";
import { runMutation } from "@/lib/mutate";
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
  const { data: budget, mutate: mutateBudget } = useBudget(year, month);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const totalIncome = incomeItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
  const totalExpense = expenseItems?.reduce((sum, i) => sum + i.amount, 0) ?? 0;

  const handleBudgetSaved = () => {
    mutateBudget();
    globalMutate(`/api/summary?year=${year}`);
  };

  const handleApplyTemplates = () =>
    runMutation(() => api.post("/api/expense-templates/apply", { year, month }), {
      success: "固定費を登録しました",
      error: "固定費を登録できませんでした",
      onDone: mutateExpense,
    });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
          <Link href="/dashboard" className="text-primary-text hover:underline text-sm">
            ダッシュボードへ戻る
          </Link>
          <h2 className="text-2xl font-bold text-foreground">
            {year}年{month}月
          </h2>
        </div>
        <ApplyTemplatesButton onApply={handleApplyTemplates} />
      </div>

      <div className="mb-4">
        <SummaryBar income={totalIncome} expense={totalExpense} />
      </div>

      <div className="mb-4">
        <InsightCard year={year} month={month} />
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-2">
        <BudgetProgress
          expense={totalExpense}
          budget={budget?.amount}
          onEdit={() => setBudgetOpen(true)}
        />
        <SavingsProgress mode="monthly" income={totalIncome} balance={totalIncome - totalExpense} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <IncomeSection year={year} month={month} />
        <ExpenseSection year={year} month={month} />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {incomeSummary && incomeSummary.length > 0 && (
          <CategoryPieChart data={incomeSummary} title="収入カテゴリー" />
        )}
        {expenseSummary && expenseSummary.length > 0 && (
          <CategoryPieChart data={expenseSummary} title="支出カテゴリー" />
        )}
      </div>

      <BudgetDialog
        open={budgetOpen}
        year={year}
        month={month}
        budget={budget?.amount}
        onOpenChange={setBudgetOpen}
        onSaved={handleBudgetSaved}
      />
    </div>
  );
}
