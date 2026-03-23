import type { Item, Category } from "@/types";

export type ItemGroup = {
  categoryId: number | null;
  categoryName: string;
  categoryColor: string | null;
  items: Item[];
};

export function groupItemsByCategory(items: Item[], categories: Category[]): ItemGroup[] {
  if (items.length === 0) return [];

  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const groups = new Map<number | null, ItemGroup>();

  for (const item of items) {
    const catId = item.category_id;
    if (!groups.has(catId)) {
      const cat = catId != null ? categoryMap.get(catId) : undefined;
      groups.set(catId, {
        categoryId: catId,
        categoryName: cat?.name ?? "未分類",
        categoryColor: cat?.color ?? null,
        items: [],
      });
    }
    groups.get(catId)!.items.push(item);
  }

  const sorted = [...groups.values()].sort((a, b) => {
    if (a.categoryId === null) return 1;
    if (b.categoryId === null) return -1;
    return a.categoryName.localeCompare(b.categoryName);
  });

  return sorted;
}
