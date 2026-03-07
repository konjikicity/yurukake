import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetInput from "@/components/BudgetInput";

describe("BudgetInput", () => {
  it("renders current budget", () => {
    render(<BudgetInput budget={200000} onSave={jest.fn()} />);
    expect(screen.getByDisplayValue("200000")).toBeInTheDocument();
  });

  it("renders empty when no budget", () => {
    render(<BudgetInput budget={null} onSave={jest.fn()} />);
    expect(screen.getByPlaceholderText("予算額")).toHaveValue(null);
  });

  it("calls onSave with new amount", async () => {
    const onSave = jest.fn();
    render(<BudgetInput budget={null} onSave={onSave} />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("予算額"), "200000");
    await user.click(screen.getByRole("button", { name: "設定" }));

    expect(onSave).toHaveBeenCalledWith(200000);
  });
});
