import { render, screen, fireEvent } from "@testing-library/react";
import ItemRow from "@/components/ItemRow";

describe("ItemRow", () => {
  const defaultProps = {
    id: 1,
    name: "給料",
    amount: 300000,
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
  };

  it("renders item name and amount", () => {
    render(<ItemRow {...defaultProps} />);
    expect(screen.getByText("給料")).toBeInTheDocument();
    expect(screen.getByText("300,000")).toBeInTheDocument();
  });

  it("shows delete icon button", () => {
    render(<ItemRow {...defaultProps} />);
    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });

  it("shows edit icon button", () => {
    render(<ItemRow {...defaultProps} />);
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
  });

  it("enters edit mode when edit icon is clicked", () => {
    render(<ItemRow {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: "編集" }));
    expect(screen.getByDisplayValue("300000")).toBeInTheDocument();
  });

  it("enters edit mode when amount is clicked", () => {
    render(<ItemRow {...defaultProps} />);
    fireEvent.click(screen.getByText("300,000"));
    expect(screen.getByDisplayValue("300000")).toBeInTheDocument();
  });

  it("calls onDelete when delete icon is clicked", () => {
    const onDelete = jest.fn();
    render(<ItemRow {...defaultProps} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: "削除" }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("calls onUpdate when save is clicked after editing amount", () => {
    const onUpdate = jest.fn();
    render(<ItemRow {...defaultProps} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByRole("button", { name: "編集" }));
    const amountInput = screen.getByDisplayValue("300000");
    fireEvent.change(amountInput, { target: { value: "350000" } });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));
    expect(onUpdate).toHaveBeenCalledWith(1, "給料", 350000);
  });
});
