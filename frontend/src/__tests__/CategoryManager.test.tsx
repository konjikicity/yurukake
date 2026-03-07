import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryManager from "@/components/CategoryManager";
import type { Category } from "@/types";

const mockCategories: Category[] = [
  { id: 1, user_id: 1, type: "expense", name: "食費", color: "#ff9800", created_at: "", updated_at: "" },
  { id: 2, user_id: 1, type: "expense", name: "家賃", color: "#2196f3", created_at: "", updated_at: "" },
];

describe("CategoryManager", () => {
  it("renders category list", () => {
    render(
      <CategoryManager
        categories={mockCategories}
        type="expense"
        onAdd={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );
    expect(screen.getByText("食費")).toBeInTheDocument();
    expect(screen.getByText("家賃")).toBeInTheDocument();
  });

  it("can add a new category", async () => {
    const onAdd = jest.fn();
    render(
      <CategoryManager
        categories={[]}
        type="expense"
        onAdd={onAdd}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("カテゴリー名"), "交通費");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledWith("交通費", expect.any(String));
  });

  it("can delete a category", async () => {
    const onDelete = jest.fn();
    render(
      <CategoryManager
        categories={mockCategories}
        type="expense"
        onAdd={jest.fn()}
        onDelete={onDelete}
        onUpdate={jest.fn()}
      />
    );
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
