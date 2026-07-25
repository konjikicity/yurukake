import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { budgetStatus } from "@/lib/budget";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
  budget?: number | null;
  prevIncome?: number;
  prevExpense?: number;
};

function formatNumber(n: number): string {
  return n.toLocaleString();
}

const BAR = {
  safe: "bg-primary",
  warn: "bg-chart-4",
  over: "bg-expense",
  none: "bg-muted",
} as const;

export default function MonthCard({
  year,
  month,
  income,
  expense,
  balance,
  budget,
  prevExpense,
}: Props) {
  const { percent, level } = budgetStatus(expense, budget);
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
            <span className="text-income-text">{formatNumber(income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-expense-text">支出</span>
            <span className="text-expense-text">{formatNumber(expense)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>収支</span>
            <span className={balance < 0 ? "text-expense-text" : ""}>
              {formatNumber(balance)}
            </span>
          </div>
          {level !== "none" && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-xs">
                {level === "over" ? (
                  <Badge variant="destructive">予算オーバー</Badge>
                ) : (
                  <span className="text-muted-foreground">予算 {percent}%</span>
                )}
              </div>
              <Progress
                value={Math.min(100, percent)}
                aria-label="予算の消化率"
                trackClassName="h-1.5"
                indicatorClassName={BAR[level]}
              />
            </div>
          )}
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
