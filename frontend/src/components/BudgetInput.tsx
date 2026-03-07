"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  budget: number | null;
  onSave: (amount: number) => void;
};

export default function BudgetInput({ budget, onSave }: Props) {
  const [amount, setAmount] = useState<string>(budget?.toString() ?? "");

  useEffect(() => {
    setAmount(budget?.toString() ?? "");
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    onSave(Number(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="予算額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-40"
      />
      <Button type="submit" variant="outline" size="sm">
        設定
      </Button>
    </form>
  );
}
