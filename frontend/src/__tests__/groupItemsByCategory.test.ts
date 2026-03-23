import { groupItemsByCategory } from "@/lib/group-items";
import type { Item, Category } from "@/types";

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  user_id: 1,
  year: 2026,
  month: 3,
  name: "テスト",
  amount: 1000,
  category_id: null,
  created_at: "",
  updated_at: "",
  ...overrides,
});

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 1,
  user_id: 1,
  type: "income",
  name: "給与",
  color: "#ff9800",
  created_at: "",
  updated_at: "",
  ...overrides,
});

describe("groupItemsByCategory", () => {
  it("カテゴリーがないアイテムは「未分類」にグループ化される", () => {
    const items = [makeItem({ id: 1, category_id: null })];
    const result = groupItemsByCategory(items, []);
    expect(result).toEqual([
      {
        categoryId: null,
        categoryName: "未分類",
        categoryColor: null,
        items: [items[0]],
      },
    ]);
  });

  it("同じカテゴリーのアイテムがグループ化される", () => {
    const categories = [makeCategory({ id: 10, name: "食費", color: "#e91e63" })];
    const items = [
      makeItem({ id: 1, name: "ランチ", category_id: 10 }),
      makeItem({ id: 2, name: "ディナー", category_id: 10 }),
    ];
    const result = groupItemsByCategory(items, categories);
    expect(result).toHaveLength(1);
    expect(result[0].categoryName).toBe("食費");
    expect(result[0].categoryColor).toBe("#e91e63");
    expect(result[0].items).toHaveLength(2);
  });

  it("複数カテゴリーが正しくグループ化される", () => {
    const categories = [
      makeCategory({ id: 10, name: "食費", color: "#e91e63" }),
      makeCategory({ id: 20, name: "交通費", color: "#2196f3" }),
    ];
    const items = [
      makeItem({ id: 1, name: "ランチ", category_id: 10 }),
      makeItem({ id: 2, name: "電車", category_id: 20 }),
      makeItem({ id: 3, name: "ディナー", category_id: 10 }),
    ];
    const result = groupItemsByCategory(items, categories);
    expect(result).toHaveLength(2);
    const foodGroup = result.find((g) => g.categoryName === "食費");
    const transportGroup = result.find((g) => g.categoryName === "交通費");
    expect(foodGroup?.items).toHaveLength(2);
    expect(transportGroup?.items).toHaveLength(1);
  });

  it("未分類は最後に表示される", () => {
    const categories = [makeCategory({ id: 10, name: "食費" })];
    const items = [
      makeItem({ id: 1, category_id: null }),
      makeItem({ id: 2, category_id: 10 }),
    ];
    const result = groupItemsByCategory(items, categories);
    expect(result).toHaveLength(2);
    expect(result[result.length - 1].categoryName).toBe("未分類");
  });

  it("空の配列の場合は空を返す", () => {
    const result = groupItemsByCategory([], []);
    expect(result).toEqual([]);
  });
});
