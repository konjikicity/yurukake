"use client";

import { useExpenseItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { addItem, deleteItemWithUndo, updateItem } from "@/lib/item-actions";
import ItemSection from "./ItemSection";

type Props = {
  year: number;
  month: number;
};

export default function ExpenseSection({ year, month }: Props) {
  const { data: items } = useExpenseItems(year, month);
  const { data: categories } = useCategories("expense");

  const findItem = (id: number) => items?.find((item) => item.id === id);

  return (
    <ItemSection
      title="支出"
      accent="expense"
      items={items ?? []}
      categories={categories ?? []}
      onAdd={(name, amount, categoryId) =>
        addItem("expense", { year, month, name, amount, category_id: categoryId ?? null })
      }
      onDelete={(id) => {
        const item = findItem(id);
        if (item) deleteItemWithUndo("expense", item);
      }}
      onUpdate={(id, name, amount) => updateItem("expense", { id, year }, name, amount)}
    />
  );
}
