"use client";

import Link from "next/link";
import { useAccountBalance } from "@/hooks/use-account-balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountBalanceCard() {
  const { data: balance, isLoading } = useAccountBalance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">口座残高</CardTitle>
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
          <CardTitle className="text-base">口座残高</CardTitle>
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
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span>口座残高</span>
          {!balance.is_current && balance.month !== null && (
            <span className="text-xs font-normal text-muted-foreground">{balance.month}月時点</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-2xl font-bold text-primary-text tabular-nums">
          {balance.amount.toLocaleString()}円
        </p>
        {!balance.is_current && (
          <Link href="/mypage" className="text-sm text-primary-text hover:underline">
            更新する
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
