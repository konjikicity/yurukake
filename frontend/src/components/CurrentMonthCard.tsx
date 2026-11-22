"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BUDGET_BAR, budgetStatus, dailyAllowance } from "@/lib/budget";
import { yen } from "@/lib/format";
import { cn } from "@/lib/utils";
import BudgetBadge from "./BudgetBadge";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
  budget?: number | null;
  today?: Date;
};

function Headline({ label, value, note, className }: { label: string; value: string; note?: string; className: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("text-4xl font-bold tabular-nums", className)}>{value}</p>
      {note && <p className="mt-1 text-sm text-muted-foreground tabular-nums">{note}</p>}
    </div>
  );
}

export default function CurrentMonthCard({
  year,
  month,
  income,
  expense,
  balance,
  budget,
  today = new Date(),
}: Props) {
  const [open, setOpen] = useState(false);
  const { percent, remaining, over, level } = budgetStatus(expense, budget);

  return (
    <Card className="ring-2 ring-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-primary-text">{month}月（今月）</CardTitle>
        <Link href={`/dashboard/${year}/${month}`} className="text-sm text-primary-text hover:underline">
          くわしく
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {level === "none" && (
          <Headline
            label="今月の収支"
            value={yen(balance)}
            note="予算を決めると、あといくら使えるか出せます"
            className={balance < 0 ? "text-expense-text" : "text-primary-text"}
          />
        )}
        {level === "over" && (
          <Headline
            label="今月の予算"
            value="ちょっと使いすぎかも"
            note={`${yen(over)} オーバー。来月ゆるっと調整しましょ`}
            className="text-2xl text-expense-text"
          />
        )}
        {(level === "safe" || level === "warn") && (
          <Headline
            label="今月あと"
            value={yen(remaining)}
            note={`1日あたり 約${yen(dailyAllowance(remaining, today))}`}
            className="text-primary-text"
          />
        )}

        {level !== "none" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                予算 {yen(budget ?? 0)}
                <BudgetBadge level={level} />
              </span>
              <span className="tabular-nums">{percent}%</span>
            </div>
            <Progress
              value={Math.min(100, percent)}
              aria-label="予算の消化率"
              trackClassName="h-2"
              indicatorClassName={BUDGET_BAR[level]}
            />
          </div>
        )}

        <div className="border-t pt-2">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex min-h-11 w-full items-center justify-between text-sm text-muted-foreground hover:text-foreground"
          >
            {open ? "内訳をとじる" : "内訳を見る"}
            <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
          </button>
          {open && (
            <dl className="space-y-1 pb-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-income-text">収入</dt>
                <dd className="font-bold text-income-text tabular-nums">{yen(income)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-expense-text">支出</dt>
                <dd className="font-bold text-expense-text tabular-nums">{yen(expense)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>収支</dt>
                <dd className={cn("font-bold tabular-nums", balance < 0 && "text-expense-text")}>{yen(balance)}</dd>
              </div>
            </dl>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
