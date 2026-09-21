"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAccountBalance } from "@/hooks/use-account-balance";
import { runMutation } from "@/lib/mutate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountBalanceSettings() {
  const { data: balance, mutate, isLoading } = useAccountBalance();
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadedAmount, setLoadedAmount] = useState<number | null>(null);

  if (balance?.amount != null && balance.amount !== loadedAmount) {
    setLoadedAmount(balance.amount);
    setAmount(balance.amount.toString());
  }

  const handleSave = async () => {
    if (amount === "") return;
    setSaving(true);
    await runMutation(() => api.post("/api/account-balance", { amount: Number(amount) }), {
      success: "口座残高を更新しました",
      error: "口座残高を保存できませんでした",
      onDone: () => {
        setSaving(false);
        mutate();
      },
    });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">読み込み中...</p>;
  }

  const isStale = balance?.amount != null && !balance.is_current;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        いま口座にいくらあるかを入れておくと、ダッシュボードで確認できます。
      </p>

      <div className="space-y-2">
        <Label htmlFor="account-balance-amount">口座残高（円）</Label>
        <Input
          id="account-balance-amount"
          type="number"
          inputMode="numeric"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="例: 320000"
        />
      </div>

      {balance?.updated_on && (
        <p className="text-xs text-muted-foreground tabular-nums">
          最終入力 {balance.updated_on.replaceAll("-", "/")}
        </p>
      )}

      {isStale && (
        <p className="text-sm text-muted-foreground">
          {balance.month}月時点の残高です。いまの金額に更新しましょう。
        </p>
      )}

      <Button onClick={handleSave} disabled={saving || amount === ""}>
        {saving ? "保存中..." : "保存"}
      </Button>
    </div>
  );
}
