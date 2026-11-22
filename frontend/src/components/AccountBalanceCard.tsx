"use client";

import Link from "next/link";
import { useAccountBalance } from "@/hooks/use-account-balance";
import { useSummary } from "@/hooks/use-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TITLE = "現在の口座残高";

export default function AccountBalanceCard() {
  const { data: balance, isLoading } = useAccountBalance();
  const { data: summary } = useSummary(balance?.year ?? null);
  const monthBalance = summary?.find((s) => s.month === balance?.month)?.balance;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (balance?.amount == null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            口座残高がまだ登録されていません。{" "}
            <Link href="/mypage" className="text-primary-text hover:underline">
              マイページで入力する
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-2xl font-bold text-primary-text tabular-nums">
            {balance.amount.toLocaleString()}円
          </p>
          {balance.updated_on && (
            <p className="text-xs text-muted-foreground mt-1 tabular-nums">
              {balance.updated_on.replaceAll("-", "/")} 入力
            </p>
          )}
          {monthBalance != null && monthBalance < 0 && (
            <p className="text-sm text-expense-text mt-1 tabular-nums">
              収支 {monthBalance.toLocaleString()}円 → 差引後 {(balance.amount + monthBalance).toLocaleString()}円
            </p>
          )}
        </div>
        {!balance.is_current && (
          <Link href="/mypage" className="text-sm text-primary-text hover:underline">
            更新する
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
