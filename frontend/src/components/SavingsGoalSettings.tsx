"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSavingsGoal } from "@/hooks/use-savings-goal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GoalType = "fixed" | "ratio";

export default function SavingsGoalSettings() {
  const { data: goal, mutate, isLoading } = useSavingsGoal();
  const [type, setType] = useState<GoalType>("fixed");
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!goal) return;
    setType(goal.type);
    setAmount(goal.amount?.toString() ?? "");
    setPercentage(goal.percentage?.toString() ?? "");
  }, [goal]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload =
        type === "fixed"
          ? { type, amount: Number(amount) }
          : { type, percentage: Number(percentage) };
      await api.post("/api/savings-goal", payload);
      await mutate();
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    !saving &&
    ((type === "fixed" && Number(amount) > 0) ||
      (type === "ratio" && Number(percentage) >= 1 && Number(percentage) <= 100));

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">読み込み中...</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        毎月の貯金目標を設定すると、ダッシュボードや月の詳細で達成状況が表示されます。
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={type === "fixed" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("fixed")}
        >
          月額（円）
        </Button>
        <Button
          type="button"
          variant={type === "ratio" ? "default" : "outline"}
          size="sm"
          onClick={() => setType("ratio")}
        >
          収入比（%）
        </Button>
      </div>

      {type === "fixed" ? (
        <div className="space-y-2">
          <Label htmlFor="goal-amount">月いくら貯めたい？</Label>
          <div className="flex items-center gap-2">
            <Input
              id="goal-amount"
              type="number"
              inputMode="numeric"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例: 50000"
            />
            <span className="text-sm text-muted-foreground shrink-0">円</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="goal-percentage">収入の何%を貯める？</Label>
          <div className="flex items-center gap-2">
            <Input
              id="goal-percentage"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="例: 20"
            />
            <span className="text-sm text-muted-foreground shrink-0">%</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={!canSave}>
          {saving ? "保存中..." : "保存"}
        </Button>
        {savedAt && !saving && (
          <span className="text-sm text-income-text">保存しました</span>
        )}
      </div>
    </div>
  );
}
