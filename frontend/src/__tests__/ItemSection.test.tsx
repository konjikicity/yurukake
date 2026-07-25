import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemSection from "@/components/ItemSection";
import type { Category, Item } from "@/types";

function item(id: number, name: string, amount: number, categoryId: number | null): Item {
  return {
    id,
    user_id: 1,
    year: 2026,
    month: 3,
    name,
    amount,
    category_id: categoryId,
    created_at: "",
    updated_at: "",
  };
}

const categories: Category[] = [
  {
    id: 1,
    user_id: 1,
    type: "expense",
    name: "食費",
    color: "#f48fb1",
    created_at: "",
    updated_at: "",
  },
];

const noop = () => {};

describe("ItemSection", () => {
  it("renders the title and groups items by category with a subtotal", () => {
    render(
      <ItemSection
        title="支出"
        accent="expense"
        items={[item(1, "スーパー", 3000, 1), item(2, "外食", 2000, 1), item(3, "雑費", 500, null)]}
        categories={categories}
        onAdd={noop}
        onDelete={noop}
        onUpdate={noop}
      />
    );

    expect(screen.getByText("支出")).toBeInTheDocument();
    expect(screen.getByText("食費")).toBeInTheDocument();
    expect(screen.getByText("(5,000)")).toBeInTheDocument();
    expect(screen.getByText("未分類")).toBeInTheDocument();
    expect(screen.getByText("スーパー")).toBeInTheDocument();
  });

  it("applies the accent colour from a static lookup, not a dynamic class name", () => {
    const { rerender } = render(
      <ItemSection
        title="収入"
        accent="income"
        items={[]}
        categories={[]}
        onAdd={noop}
        onDelete={noop}
        onUpdate={noop}
      />
    );
    expect(screen.getByText("収入")).toHaveClass("text-income-text");

    rerender(
      <ItemSection
        title="支出"
        accent="expense"
        items={[]}
        categories={[]}
        onAdd={noop}
        onDelete={noop}
        onUpdate={noop}
      />
    );
    expect(screen.getByText("支出")).toHaveClass("text-expense-text");
  });

  it("toggles the add form", async () => {
    render(
      <ItemSection
        title="収入"
        accent="income"
        items={[]}
        categories={[]}
        onAdd={noop}
        onDelete={noop}
        onUpdate={noop}
      />
    );
    const user = userEvent.setup();

    const toggle = screen.getByRole("button", { name: "追加" });
    expect(screen.queryByPlaceholderText("項目名")).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByPlaceholderText("項目名")).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.queryByPlaceholderText("項目名")).not.toBeInTheDocument();
  });

  it("passes the item id to onDelete", async () => {
    const onDelete = jest.fn();
    render(
      <ItemSection
        title="支出"
        accent="expense"
        items={[item(7, "家賃", 80000, null)]}
        categories={[]}
        onAdd={noop}
        onDelete={onDelete}
        onUpdate={noop}
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "削除" }));
    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it("shows an empty state when there are no items", () => {
    render(
      <ItemSection
        title="収入"
        accent="income"
        items={[]}
        categories={[]}
        onAdd={noop}
        onDelete={noop}
        onUpdate={noop}
      />
    );
    expect(screen.getByText("まだ登録がありません")).toBeInTheDocument();
  });
});
