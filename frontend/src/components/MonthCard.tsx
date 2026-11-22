import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { yen } from "@/lib/format";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
  prevIncome?: number;
  prevExpense?: number;
};

export default function MonthCard({
  year,
  month,
  income,
  expense,
  balance,
  prevExpense,
}: Props) {
  const yoyRate =
    prevExpense !== undefined && prevExpense > 0
      ? Math.round(((expense - prevExpense) / prevExpense) * 100)
      : null;

  return (
    <Link href={`/dashboard/${year}/${month}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:ring-primary/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{month}月</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-income-text">収入</span>
            <span className="text-income-text">{yen(income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-expense-text">支出</span>
            <span className="text-expense-text">{yen(expense)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>収支</span>
            <span className={balance < 0 ? "text-expense-text" : ""}>
              {yen(balance)}
            </span>
          </div>
          {yoyRate !== null && (
            <p className="pt-1 text-xs text-muted-foreground">
              前年同月比 {yoyRate > 0 ? "+" : ""}
              {yoyRate}%
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
