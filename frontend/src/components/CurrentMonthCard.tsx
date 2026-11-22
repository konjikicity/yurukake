"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { yen } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
};

export default function CurrentMonthCard({ year, month, income, expense, balance }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="ring-2 ring-primary">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-primary-text">{month}月（今月）</CardTitle>
        <Link href={`/dashboard/${year}/${month}`} className="text-sm text-primary-text hover:underline">
          くわしく
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">今月の収支</p>
          <p className={cn("text-4xl font-bold tabular-nums", balance < 0 ? "text-expense-text" : "text-primary-text")}>
            {yen(balance)}
          </p>
        </div>

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
