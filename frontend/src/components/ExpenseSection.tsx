"use client";

import { useExpenseItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import api from "@/lib/api";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

type Props = {
  year: number;
  month: number;
};

export default function ExpenseSection({ year, month }: Props) {
  const { data: items, mutate } = useExpenseItems(year, month);
  const { data: categories } = useCategories("expense");

  const handleAdd = async (name: string, amount: number, categoryId?: number) => {
    await api.post("/api/expense-items", { year, month, name, amount, category_id: categoryId ?? null });
    mutate();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/expense-items/${id}`);
    mutate();
  };

  const handleUpdate = async (id: number, name: string, amount: number) => {
    await api.put(`/api/expense-items/${id}`, { name, amount });
    mutate();
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-[var(--expense)]">支出</h2>
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
