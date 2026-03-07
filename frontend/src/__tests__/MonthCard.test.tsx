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
});
