"use client";

import Link from "next/link";
import { useSavingsGoal } from "@/hooks/use-savings-goal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props =
  | { mode: "monthly"; income: number; balance: number }
  | { mode: "yearly"; income: number; balance: number };

export default function SavingsProgress(props: Props) {
  const { data: goal, isLoading } = useSavingsGoal();
  const { mode, income, balance } = props;
  const label = mode === "monthly" ? "今月の貯金" : "今年の貯金";

  if (isLoading) return null;

  if (!goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{label}目標</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            貯金目標がまだ設定されていません。{" "}
            <Link href="/mypage" className="text-primary hover:underline">
              マイページで設定する
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const goalAmount =
    goal.type === "fixed"
      ? (goal.amount ?? 0) * (mode === "yearly" ? 12 : 1)
      : Math.floor((income * (goal.percentage ?? 0)) / 100);

  const achieved = balance;
  const ratio = goalAmount > 0 ? achieved / goalAmount : 0;
  const percent = Math.max(0, Math.min(100, ratio * 100));
  const isAchieved = goalAmount > 0 && achieved >= goalAmount;
  const isNegative = achieved < 0;

  const barColor = isAchieved
    ? "bg-[var(--income)]"
    : isNegative
      ? "bg-[var(--expense)]"
      : "bg-primary";

  const goalDescription =
    goal.type === "fixed"
      ? `月${(goal.amount ?? 0).toLocaleString()}円${mode === "yearly" ? "（年間)" : ""}`
      : `収入の${goal.percentage ?? 0}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>{label}目標</span>
          <span className="text-xs font-normal text-muted-foreground">{goalDescription}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between text-sm">
          <span className={isNegative ? "text-[var(--expense)] font-bold" : "font-bold"}>
            {achieved.toLocaleString()}円
          </span>
          <span className="text-muted-foreground">/ {goalAmount.toLocaleString()}円</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all`}
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {isAchieved
            ? "目標達成しました"
            : isNegative
              ? "収支がマイナスです"
              : `達成率 ${Math.round(percent)}%`}
        </p>
      </CardContent>
    </Card>
  );
}
