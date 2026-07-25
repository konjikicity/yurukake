"use client";

import { useIncomeItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import { runMutation } from "@/lib/mutate";
import api from "@/lib/api";
import ItemSection from "./ItemSection";

type Props = {
  year: number;
  month: number;
};

export default function IncomeSection({ year, month }: Props) {
  const { data: items, mutate } = useIncomeItems(year, month);
  const { data: categories } = useCategories("income");

  return (
    <ItemSection
      title="収入"
      accent="income"
      items={items ?? []}
      categories={categories ?? []}
      onAdd={(name, amount, categoryId) =>
        runMutation(
          () =>
            api.post("/api/income-items", {
              year,
              month,
              name,
              amount,
              category_id: categoryId ?? null,
            }),
          { error: "収入を追加できませんでした", onDone: mutate }
        )
      }
      onDelete={(id) =>
        runMutation(() => api.delete(`/api/income-items/${id}`), {
          error: "収入を削除できませんでした",
          onDone: mutate,
        })
      }
      onUpdate={(id, name, amount) =>
        runMutation(() => api.put(`/api/income-items/${id}`, { name, amount }), {
          error: "収入を更新できませんでした",
          onDone: mutate,
        })
      }
    />
  );
}
