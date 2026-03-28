"use client";

import { useState } from "react";
import { useIncomeItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { groupItemsByCategory } from "@/lib/group-items";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

type Props = {
  year: number;
  month: number;
};

export default function IncomeSection({ year, month }: Props) {
  const [showForm, setShowForm] = useState(false);
  const { data: items, mutate } = useIncomeItems(year, month);
  const { data: categories } = useCategories("income");

  const groups = groupItemsByCategory(items ?? [], categories ?? []);

  const handleAdd = async (name: string, amount: number, categoryId?: number) => {
    await api.post("/api/income-items", { year, month, name, amount, category_id: categoryId ?? null });
    mutate();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/income-items/${id}`);
    mutate();
  };

  const handleUpdate = async (id: number, name: string, amount: number) => {
    await api.put(`/api/income-items/${id}`, { name, amount });
    mutate();
  };

  const handleAddAndClose = (name: string, amount: number, categoryId?: number) => {
    handleAdd(name, amount, categoryId);
    setShowForm(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-[var(--income)]">収入</h2>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setShowForm(!showForm)}
          aria-label="追加"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.categoryId ?? "uncategorized"}>
            <div className="flex items-center gap-2 mb-1">
              {group.categoryColor && (
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: group.categoryColor }}
                />
              )}
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
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
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
