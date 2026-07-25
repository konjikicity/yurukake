"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { groupItemsByCategory } from "@/lib/group-items";
import type { Category, Item } from "@/types";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

const ACCENT = {
  income: { title: "text-income-text", dot: "bg-income" },
  expense: { title: "text-expense-text", dot: "bg-expense" },
} as const;

type Props = {
  title: string;
  accent: keyof typeof ACCENT;
  items: Item[];
  categories: Category[];
  onAdd: (name: string, amount: number, categoryId?: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, amount: number) => void;
};

export default function ItemSection({
  title,
  accent,
  items,
  categories,
  onAdd,
  onDelete,
  onUpdate,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const groups = groupItemsByCategory(items, categories);
  const colors = ACCENT[accent];

  const handleAddAndClose = (name: string, amount: number, categoryId?: number) => {
    onAdd(name, amount, categoryId);
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className={`text-xl font-bold ${colors.title}`}>{title}</h2>
        <Button
          size="icon"
          variant="ghost"
          className="size-9"
          onClick={() => setShowForm(!showForm)}
          aria-label="追加"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {groups.length === 0 && (
          <p className="text-sm text-muted-foreground">まだ登録がありません</p>
        )}
        {groups.map((group) => (
          <div key={group.categoryId ?? "uncategorized"}>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-3 h-3 rounded-full inline-block ${group.categoryColor ? "" : colors.dot}`}
                style={group.categoryColor ? { backgroundColor: group.categoryColor } : undefined}
              />
              <span className="text-sm font-semibold text-muted-foreground">
                {group.categoryName}
              </span>
              <span className="text-xs text-muted-foreground">
                ({group.items.reduce((s, i) => s + i.amount, 0).toLocaleString()})
              </span>
            </div>
            <div className="pl-5">
              {group.items.map((item) => (
                <ItemRow
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  amount={item.amount}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {showForm && <AddItemForm onAdd={handleAddAndClose} categories={categories} />}
    </div>
  );
}
