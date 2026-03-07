import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
  prevIncome?: number;
  prevExpense?: number;
};

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export default function MonthCard({ year, month, income, expense, balance, prevIncome, prevExpense }: Props) {
  return (
    <Link href={`/dashboard/${year}/${month}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{month}月</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--income)]">収入</span>
            <span className="text-[var(--income)]">{formatNumber(income)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--expense)]">支出</span>
            <span className="text-[var(--expense)]">{formatNumber(expense)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-1">
            <span>収支</span>
            <span className={balance < 0 ? "text-[var(--expense)]" : ""}>
              {formatNumber(balance)}
            </span>
          </div>
          {(prevIncome !== undefined && prevIncome > 0 || prevExpense !== undefined && prevExpense > 0) && (
            <div className="border-t pt-1 mt-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>前年収入</span>
                <span>{formatNumber(prevIncome ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>前年支出</span>
                <span>{formatNumber(prevExpense ?? 0)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
