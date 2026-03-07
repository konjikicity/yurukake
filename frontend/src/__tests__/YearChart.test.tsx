import { render, screen } from "@testing-library/react";
import YearChart from "@/components/YearChart";
import type { MonthlySummary } from "@/types";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => (
    <div data-testid={`bar-${dataKey}`} />
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData: MonthlySummary[] = [
  { month: 1, income: 300000, expense: 200000, balance: 100000, budget: null, prev_income: 0, prev_expense: 0 },
  { month: 2, income: 250000, expense: 180000, balance: 70000, budget: null, prev_income: 0, prev_expense: 0 },
];

describe("YearChart", () => {
  it("renders bar chart with income and expense bars", () => {
    render(<YearChart data={mockData} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-income")).toBeInTheDocument();
    expect(screen.getByTestId("bar-expense")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<YearChart data={mockData} />);
    expect(screen.getByText("年間推移")).toBeInTheDocument();
  });
});
