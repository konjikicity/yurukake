import { render, screen } from "@testing-library/react";
import BudgetProgress from "@/components/BudgetProgress";

const noop = () => {};

describe("BudgetProgress", () => {
  it("invites the user to set a budget when none exists", () => {
    render(<BudgetProgress expense={120000} budget={null} onEdit={noop} />);
    expect(screen.getByText("予算が未設定です")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "予算を設定" })).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows the remaining amount while within budget", () => {
    render(<BudgetProgress expense={80000} budget={160000} onEdit={noop} />);
    expect(screen.getByText("のこり 80,000円")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.queryByText("予算オーバー")).not.toBeInTheDocument();
  });

  it("warns as the budget is nearly used up", () => {
    render(<BudgetProgress expense={140000} budget={160000} onEdit={noop} />);
    expect(screen.getByText("のこりわずか")).toBeInTheDocument();
  });

  it("shows the overspend amount once the budget is exceeded", () => {
    render(<BudgetProgress expense={176000} budget={160000} onEdit={noop} />);
    expect(screen.getByText("予算オーバー")).toBeInTheDocument();
    expect(screen.getByText("16,000円 こえています")).toBeInTheDocument();
  });

  it("caps the progress bar at 100 when overspent", () => {
    render(<BudgetProgress expense={320000} budget={160000} onEdit={noop} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByText("200%")).toBeInTheDocument();
  });
});
