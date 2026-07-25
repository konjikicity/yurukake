import { render, screen } from "@testing-library/react";
import MonthCard from "@/components/MonthCard";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("MonthCard", () => {
  it("renders month, income, expense, and balance", () => {
    render(
      <MonthCard
        year={2026}
        month={3}
        income={300000}
        expense={200000}
        balance={100000}
      />
    );

    expect(screen.getByText("3月")).toBeInTheDocument();
    expect(screen.getByText("300,000")).toBeInTheDocument();
    expect(screen.getByText("200,000")).toBeInTheDocument();
    expect(screen.getByText("100,000")).toBeInTheDocument();
  });

  it("shows negative balance in red-ish style", () => {
    render(
      <MonthCard
        year={2026}
        month={1}
        income={100000}
        expense={200000}
        balance={-100000}
      />
    );

    expect(screen.getByText("-100,000")).toBeInTheDocument();
  });

  it("renders no budget UI when no budget is given", () => {
    render(
      <MonthCard year={2026} month={3} income={300000} expense={200000} balance={100000} />
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText(/予算/)).not.toBeInTheDocument();
  });

  it("shows the budget usage rate when a budget is given", () => {
    render(
      <MonthCard
        year={2026}
        month={3}
        income={300000}
        expense={200000}
        balance={100000}
        budget={250000}
      />
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "80");
    expect(screen.getByText("予算 80%")).toBeInTheDocument();
  });

  it("flags an exceeded budget", () => {
    render(
      <MonthCard
        year={2026}
        month={3}
        income={300000}
        expense={200000}
        balance={100000}
        budget={160000}
      />
    );

    expect(screen.getByText("予算オーバー")).toBeInTheDocument();
  });
});
