"use client";

import type { Category } from "@/types";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

type Template = {
  id: number;
  name: string;
  amount: number;
  category_id: number | null;
};

type Props = {
  templates: Template[];
  categories: Category[];
  onAdd: (name: string, amount: number, categoryId?: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, amount: number) => void;
};

export default function TemplateList({ templates, categories, onAdd, onDelete, onUpdate }: Props) {
  const getCategoryName = (categoryId: number | null) => {
    if (categoryId === null) return null;
    return categories.find((c) => c.id === categoryId)?.name ?? null;
  };

  const getCategoryColor = (categoryId: number | null) => {
    if (categoryId === null) return null;
    return categories.find((c) => c.id === categoryId)?.color ?? null;
  };

  return (
    <div className="space-y-3">
      <div>
        {templates.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            {getCategoryColor(t.category_id) && (
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(t.category_id) || undefined }}
              />
            )}
            {getCategoryName(t.category_id) && (
              <span className="text-xs text-muted-foreground shrink-0">
                {getCategoryName(t.category_id)}
              </span>
            )}
            <div className="flex-1">
              <ItemRow
                id={t.id}
                name={t.name}
                amount={t.amount}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </div>
          </div>
        ))}
      </div>
      <AddItemForm onAdd={onAdd} categories={categories} />
    </div>
  );
}
