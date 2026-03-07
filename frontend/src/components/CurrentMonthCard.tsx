import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  year: number;
  month: number;
  income: number;
  expense: number;
  balance: number;
};

function formatNumber(n: number): string {
  return n.toLocaleString();
}

export default function CurrentMonthCard({ year, month, income, expense, balance }: Props) {
  return (
    <Link href={`/dashboard/${year}/${month}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">
            {month}月（今月）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-lg">
            <span className="text-[var(--income)]">収入</span>
            <span className="text-[var(--income)] font-bold">{formatNumber(income)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-[var(--expense)]">支出</span>
            <span className="text-[var(--expense)] font-bold">{formatNumber(expense)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>収支</span>
            <span className={balance < 0 ? "text-[var(--expense)]" : "text-primary"}>
              {formatNumber(balance)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
