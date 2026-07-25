"use client";

import { useExpenseItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { runMutation } from "@/lib/mutate";
import api from "@/lib/api";
import ItemSection from "./ItemSection";

type Props = {
  year: number;
  month: number;
};

export default function ExpenseSection({ year, month }: Props) {
  const { data: items, mutate } = useExpenseItems(year, month);
  const { data: categories } = useCategories("expense");

  return (
    <ItemSection
      title="支出"
      accent="expense"
      items={items ?? []}
      categories={categories ?? []}
      onAdd={(name, amount, categoryId) =>
        runMutation(
          () =>
            api.post("/api/expense-items", {
              year,
              month,
              name,
              amount,
              category_id: categoryId ?? null,
            }),
          { error: "支出を追加できませんでした", onDone: mutate }
        )
      }
      onDelete={(id) =>
        runMutation(() => api.delete(`/api/expense-items/${id}`), {
          error: "支出を削除できませんでした",
          onDone: mutate,
        })
      }
      onUpdate={(id, name, amount) =>
        runMutation(() => api.put(`/api/expense-items/${id}`, { name, amount }), {
          error: "支出を更新できませんでした",
          onDone: mutate,
        })
      }
    />
  );
}
