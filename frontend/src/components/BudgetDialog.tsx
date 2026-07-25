"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { runMutation } from "@/lib/mutate";
import api from "@/lib/api";

type Props = {
  open: boolean;
  year: number;
  month: number;
  budget: number | null | undefined;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

function BudgetForm({ year, month, budget, onOpenChange, onSaved }: Omit<Props, "open">) {
  const [amount, setAmount] = useState(budget?.toString() ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (amount === "") return;
    setSaving(true);
    await runMutation(
      () => api.post("/api/monthly-budgets", { year, month, amount: Number(amount) }),
      {
        success: "予算を設定しました",
        error: "予算を保存できませんでした",
        onDone: () => {
          setSaving(false);
          onSaved();
        },
      }
    );
    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {year}年{month}月の予算
        </DialogTitle>
        <DialogDescription>
          その月に使ってよい上限です。あとから何度でも変えられます。
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2">
        <Label htmlFor="budget-amount">予算（円）</Label>
        <Input
          id="budget-amount"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="160000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          キャンセル
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          保存
        </Button>
      </DialogFooter>
    </>
  );
}

export default function BudgetDialog({ open, onOpenChange, ...rest }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <BudgetForm onOpenChange={onOpenChange} {...rest} />
      </DialogContent>
    </Dialog>
  );
}
