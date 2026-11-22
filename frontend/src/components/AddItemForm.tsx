"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const UNCATEGORIZED = "未分類";

type Props = {
  onAdd: (name: string, amount: number, categoryId?: number) => void;
  categories?: Category[];
  autoFocus?: boolean;
};

type ChipProps = {
  label: string;
  color?: string | null;
  pressed: boolean;
  onClick: () => void;
};

function CategoryChip({ label, color, pressed, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
        pressed
          ? "border-primary bg-primary/15 font-medium text-foreground"
          : "border-border text-muted-foreground hover:bg-muted"
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2.5 rounded-full", color ? "" : "bg-muted-foreground/40")}
        style={color ? { backgroundColor: color } : undefined}
      />
      {label}
    </button>
  );
}

export default function AddItemForm({ onAdd, categories, autoFocus }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    const category = categories?.find((c) => c.id === categoryId);
    onAdd(name.trim() || category?.name || UNCATEGORIZED, Number(amount), category?.id);
    setName("");
    setAmount("");
    setCategoryId(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label={UNCATEGORIZED}
            pressed={categoryId === null}
            onClick={() => setCategoryId(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              color={cat.color}
              pressed={categoryId === cat.id}
              onClick={() => setCategoryId(cat.id)}
            />
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus={autoFocus}
          className="h-11 w-28 sm:w-32"
        />
        <Input
          placeholder="項目名（なくてもOK）"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 flex-1 min-w-0"
        />
        <Button type="submit" className="h-11">
          追加
        </Button>
      </div>
    </form>
  );
}
