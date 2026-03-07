import { render, screen } from "@testing-library/react";
import CategoryPieChart from "@/components/CategoryPieChart";
import type { CategorySummary } from "@/types";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData: CategorySummary[] = [
  { category_id: 1, category_name: "食費", total: 50000 },
  { category_id: 2, category_name: "家賃", total: 80000 },
  { category_id: null, category_name: "未分類", total: 5000 },
];

describe("CategoryPieChart", () => {
  it("renders pie chart", () => {
    render(<CategoryPieChart data={mockData} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders title", () => {
    render(<CategoryPieChart data={mockData} title="支出カテゴリー" />);
    expect(screen.getByText("支出カテゴリー")).toBeInTheDocument();
  });

  it("shows message when no data", () => {
    render(<CategoryPieChart data={[]} />);
    expect(screen.getByText("データがありません")).toBeInTheDocument();
  });
});
