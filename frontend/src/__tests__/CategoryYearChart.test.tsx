import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryYearChart from "@/components/CategoryYearChart";
import type { CategoryYearlySummary } from "@/types";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Bar: ({ dataKey }: { dataKey: string }) => <div data-testid={`bar-${dataKey}`} />,
  Line: ({ dataKey }: { dataKey: string }) => <div data-testid={`line-${dataKey}`} />,
  CartesianGrid: () => <div data-testid="grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const summary: CategoryYearlySummary = {
  series: [
    { key: "cat_1", name: "家賃", color: "#7ec8e3", total: 960000 },
    { key: "cat_3", name: "食費", color: null, total: 720000 },
  ],
  data: Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    cat_1: 80000,
    cat_3: 60000,
    total: 140000,
  })),
};

describe("CategoryYearChart", () => {
  it("renders one stacked bar per series", () => {
    render(<CategoryYearChart data={summary} />);
    expect(screen.getByTestId("bar-cat_1")).toBeInTheDocument();
    expect(screen.getByTestId("bar-cat_3")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("switches to a line chart", async () => {
    render(<CategoryYearChart data={summary} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("tab", { name: "折れ線" }));

    expect(await screen.findByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-cat_1")).toBeInTheDocument();
  });

  it("shows an empty state when there are no series", () => {
    render(
      <CategoryYearChart
        data={{ series: [], data: summary.data }}
      />
    );
    expect(screen.getByText("データがありません")).toBeInTheDocument();
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    render(<CategoryYearChart data={undefined} isLoading />);
    expect(screen.queryByTestId("bar-chart")).not.toBeInTheDocument();
    expect(screen.queryByText("データがありません")).not.toBeInTheDocument();
  });
});
