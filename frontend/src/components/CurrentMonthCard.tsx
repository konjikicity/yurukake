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

export default function CurrentMonthCard({ year, month, income, expense, balance, budget }: Props) {
  const { percent, remaining, over, level } = budgetStatus(expense, budget);
  return (
    <Link href={`/dashboard/${year}/${month}`}>
      <Card className="cursor-pointer ring-2 ring-primary transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-primary-text">
            {month}月（今月）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-income-text">収入</span>
            <span className="text-income-text font-bold">{formatNumber(income)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-expense-text">支出</span>
            <span className="text-expense-text font-bold">{formatNumber(expense)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>収支</span>
            <span className={balance < 0 ? "text-expense-text" : "text-primary-text"}>
              {formatNumber(balance)}
            </span>
          </div>
          {level !== "none" && (
            <div className="space-y-2 border-t pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  予算 {formatNumber(budget ?? 0)}
                  {level === "over" && <Badge variant="destructive">オーバー</Badge>}
                  {level === "warn" && <Badge variant="secondary">のこりわずか</Badge>}
                </span>
                <span className="text-muted-foreground tabular-nums">{percent}%</span>
              </div>
              <Progress
                value={Math.min(100, percent)}
                aria-label="予算の消化率"
                trackClassName="h-2"
                indicatorClassName={BAR[level]}
              />
              <p className="text-xs text-muted-foreground">
                {level === "over"
                  ? `${formatNumber(over)}円 こえています`
                  : `のこり ${formatNumber(remaining)}円`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
