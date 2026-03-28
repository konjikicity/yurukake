import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IncomeSection from "@/components/IncomeSection";

jest.mock("@/hooks/use-items", () => ({
  useIncomeItems: () => ({ data: [], mutate: jest.fn() }),
}));

jest.mock("@/hooks/use-categories", () => ({
  useCategories: () => ({ data: [] }),
}));

describe("IncomeSection", () => {
  it("does not show AddItemForm by default", () => {
    render(<IncomeSection year={2026} month={3} />);
    expect(screen.queryByPlaceholderText("項目名")).not.toBeInTheDocument();
  });

  it("shows add button with plus icon", () => {
    render(<IncomeSection year={2026} month={3} />);
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  it("shows AddItemForm when add button is clicked", async () => {
    render(<IncomeSection year={2026} month={3} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(screen.getByPlaceholderText("項目名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("金額")).toBeInTheDocument();
  });

  it("hides AddItemForm when add button is clicked again", async () => {
    render(<IncomeSection year={2026} month={3} />);
    const user = userEvent.setup();
    const addButton = screen.getByRole("button", { name: "追加" });
    await user.click(addButton);
    expect(screen.getByPlaceholderText("項目名")).toBeInTheDocument();
    await user.click(addButton);
    expect(screen.queryByPlaceholderText("項目名")).not.toBeInTheDocument();
  });
});
