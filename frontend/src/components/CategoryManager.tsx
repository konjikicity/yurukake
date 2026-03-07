"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types";

const DEFAULT_COLORS = [
  "#ff9800", "#2196f3", "#4caf50", "#e91e63",
  "#9c27b0", "#00bcd4", "#ff5722", "#607d8b",
];

type Props = {
  categories: Category[];
  type: "income" | "expense";
  onAdd: (name: string, color: string) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, color: string) => void;
};

export default function CategoryManager({ categories, type, onAdd, onDelete, onUpdate }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, color);
    setName("");
    setColor(DEFAULT_COLORS[(categories.length + 1) % DEFAULT_COLORS.length]);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: cat.color || "#ccc" }}
            />
            <span className="flex-1">{cat.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(cat.id)}
            >
              削除
            </Button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
        <Input
          placeholder="カテゴリー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">追加</Button>
      </form>
    </div>
  );
}
