"use client";

import { useIncomeItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import api from "@/lib/api";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

type Props = {
  year: number;
  month: number;
};

export default function IncomeSection({ year, month }: Props) {
  const { data: items, mutate } = useIncomeItems(year, month);
  const { data: categories } = useCategories("income");

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

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-[var(--income)]">収入</h2>
      <div>
        {items?.map((item) => (
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
      <AddItemForm onAdd={handleAdd} categories={categories} />
    </div>
  );
}
