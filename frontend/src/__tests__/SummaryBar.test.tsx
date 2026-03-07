import { render, screen } from "@testing-library/react";
import SummaryBar from "@/components/SummaryBar";

describe("SummaryBar", () => {
  it("renders income, expense, and balance totals", () => {
    render(<SummaryBar income={300000} expense={200000} />);

    expect(screen.getByText("収入合計")).toBeInTheDocument();
    expect(screen.getByText("300,000")).toBeInTheDocument();
    expect(screen.getByText("支出合計")).toBeInTheDocument();
    expect(screen.getByText("200,000")).toBeInTheDocument();
    expect(screen.getByText("収支")).toBeInTheDocument();
    expect(screen.getByText("100,000")).toBeInTheDocument();
  });
});
