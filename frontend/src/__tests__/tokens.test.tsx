import { render, screen } from "@testing-library/react";
import SummaryBar from "@/components/SummaryBar";
import MonthCard from "@/components/MonthCard";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("design tokens", () => {
  it("uses the accessible income text token, not the pastel fill token", () => {
    render(<SummaryBar income={300000} expense={200000} />);
    const amount = screen.getByText("300,000");
    expect(amount).toHaveClass("text-income-text");
    expect(amount).not.toHaveClass("text-income");
  });

  it("uses the accessible expense text token, not the pastel fill token", () => {
    render(<SummaryBar income={300000} expense={200000} />);
    const amount = screen.getByText("200,000");
    expect(amount).toHaveClass("text-expense-text");
    expect(amount).not.toHaveClass("text-expense");
  });

  it("keeps no arbitrary var() color notation in rendered markup", () => {
    const { container } = render(
      <MonthCard year={2026} month={3} income={300000} expense={200000} balance={100000} />
    );
    expect(container.innerHTML).not.toContain("var(--income)");
    expect(container.innerHTML).not.toContain("var(--expense)");
  });
});
