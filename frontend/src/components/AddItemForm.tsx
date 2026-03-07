"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types";

type Props = {
  onAdd: (name: string, amount: number, categoryId?: number) => void;
  categories?: Category[];
};

export default function AddItemForm({ onAdd, categories }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    onAdd(name, Number(amount), categoryId ? Number(categoryId) : undefined);
    setName("");
    setAmount("");
    setCategoryId("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {categories && categories.length > 0 && (
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
        >
          <option value="">未分類</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}
      <Input
        placeholder="項目名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1"
      />
      <Input
        type="number"
        placeholder="金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-32"
      />
      <Button type="submit">追加</Button>
    </form>
  );
}
