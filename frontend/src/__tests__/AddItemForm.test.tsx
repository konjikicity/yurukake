import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddItemForm from "@/components/AddItemForm";

describe("AddItemForm", () => {
  it("renders name and amount inputs", () => {
    render(<AddItemForm onAdd={jest.fn()} />);
    expect(screen.getByPlaceholderText("項目名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("金額")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  it("calls onAdd with name and amount", async () => {
    const onAdd = jest.fn();
    render(<AddItemForm onAdd={onAdd} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("項目名"), "給料");
    await user.type(screen.getByPlaceholderText("金額"), "300000");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledWith("給料", 300000, undefined);
  });
});
