"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { budgetStatus } from "@/lib/budget";

type Props = {
  expense: number;
  budget: number | null | undefined;
  onEdit: () => void;
};

const BAR = {
  safe: "bg-primary",
  warn: "bg-chart-4",
  over: "bg-expense",
  none: "bg-muted",
} as const;

export default function BudgetProgress({ expense, budget, onEdit }: Props) {
  const { percent, remaining, over, level } = budgetStatus(expense, budget);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            今月の予算
            {level === "over" && <Badge variant="destructive">予算オーバー</Badge>}
            {level === "warn" && <Badge variant="secondary">のこりわずか</Badge>}
          </span>
          <Button variant="outline" size="sm" onClick={onEdit}>
            {level === "none" ? "予算を設定" : "予算を変更"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {level === "none" ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">予算が未設定です</p>
            <p className="text-xs text-muted-foreground">
              決めておくと、使いすぎに気づけます。
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between text-sm">
              <span className="font-bold">
                {expense.toLocaleString()}円 / {(budget ?? 0).toLocaleString()}円
              </span>
              <span className="text-muted-foreground tabular-nums">{percent}%</span>
            </div>
            <Progress
              value={Math.min(100, percent)}
              aria-label="予算の消化率"
              trackClassName="h-3"
              indicatorClassName={BAR[level]}
            />
            <p className="text-xs text-muted-foreground">
              {level === "over"
                ? `${over.toLocaleString()}円 こえています`
                : `のこり ${remaining.toLocaleString()}円`}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
