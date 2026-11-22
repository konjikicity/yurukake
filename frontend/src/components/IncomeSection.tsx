"use client";

import { useIncomeItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { addItem, deleteItemWithUndo, updateItem } from "@/lib/item-actions";
import ItemSection from "./ItemSection";

type Props = {
  year: number;
  month: number;
};

export default function IncomeSection({ year, month }: Props) {
  const { data: items } = useIncomeItems(year, month);
  const { data: categories } = useCategories("income");

  const findItem = (id: number) => items?.find((item) => item.id === id);

  return (
    <ItemSection
      title="収入"
      accent="income"
      items={items ?? []}
      categories={categories ?? []}
      onAdd={(name, amount, categoryId) =>
        addItem("income", { year, month, name, amount, category_id: categoryId ?? null })
      }
      onDelete={(id) => {
        const item = findItem(id);
        if (item) deleteItemWithUndo("income", item);
      }}
      onUpdate={(id, name, amount) => updateItem("income", { id, year }, name, amount)}
    />
  );
}
