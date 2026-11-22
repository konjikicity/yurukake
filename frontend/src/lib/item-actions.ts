import { mutate } from "swr";
import { toast } from "sonner";
import api from "@/lib/api";
import { runMutation } from "@/lib/mutate";
import type { Item } from "@/types";

export type ItemKind = "income" | "expense";

type ItemPayload = Pick<Item, "year" | "month" | "name" | "amount" | "category_id">;

const LABEL: Record<ItemKind, string> = { income: "収入", expense: "支出" };

const YEAR_SCOPED_KEYS = [
  "/api/summary",
  "/api/category-summary",
  "/api/category-yearly-summary",
  "/api/income-items",
  "/api/expense-items",
];

function isKeyOfYear(key: unknown, year: number): boolean {
  if (typeof key !== "string") return false;
  const [path, query = ""] = key.split("?");
  return YEAR_SCOPED_KEYS.includes(path) && new URLSearchParams(query).get("year") === String(year);
}

export function revalidateYear(year: number) {
  return mutate((key) => isKeyOfYear(key, year));
}

export function addItem(kind: ItemKind, payload: ItemPayload, success?: string) {
  return runMutation(() => api.post(`/api/${kind}-items`, payload), {
    success,
    error: `${LABEL[kind]}を追加できませんでした`,
    onDone: () => revalidateYear(payload.year),
  });
}

export function updateItem(kind: ItemKind, item: Pick<Item, "id" | "year">, name: string, amount: number) {
  return runMutation(() => api.put(`/api/${kind}-items/${item.id}`, { name, amount }), {
    error: `${LABEL[kind]}を更新できませんでした`,
    onDone: () => revalidateYear(item.year),
  });
}

export async function deleteItemWithUndo(kind: ItemKind, item: Item) {
  const result = await runMutation(() => api.delete(`/api/${kind}-items/${item.id}`), {
    error: `${LABEL[kind]}を削除できませんでした`,
    onDone: () => revalidateYear(item.year),
  });
  if (result === undefined) return;

  const { year, month, name, amount, category_id } = item;
  toast(`「${name}」を削除しました`, {
    action: {
      label: "元に戻す",
      onClick: () => addItem(kind, { year, month, name, amount, category_id }, "元に戻しました"),
    },
  });
}
