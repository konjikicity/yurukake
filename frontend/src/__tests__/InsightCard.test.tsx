import { render, screen } from "@testing-library/react";
import InsightCard from "@/components/InsightCard";
import { useInsights } from "@/hooks/use-insights";
import type { Insights } from "@/types";

jest.mock("@/hooks/use-insights");

const mocked = useInsights as jest.MockedFunction<typeof useInsights>;

const swr = (data: Insights | undefined, isLoading: boolean) =>
  ({ data, isLoading }) as ReturnType<typeof useInsights>;

describe("InsightCard", () => {
  it("renders one line per fact", () => {
    mocked.mockReturnValue(
      swr(
        {
          year: 2026,
          month: 6,
          facts: [
            {
              type: "yoy_expense",
              current: 182000,
              previous: 205000,
              diff: -23000,
              rate: -11.2,
              direction: "down",
            },
            { type: "budget", budget: 200000, expense: 182000, rate: 91, level: "warn" },
          ],
        },
        false
      )
    );

    render(<InsightCard year={2026} month={6} />);

    expect(screen.getByText(/23,000円 おさえられてます/)).toBeInTheDocument();
    expect(screen.getByText(/予算の 91% をつかいました/)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("falls back to the placeholder when there is nothing to say", () => {
    mocked.mockReturnValue(swr({ year: 2026, month: 6, facts: [] }, false));

    render(<InsightCard year={2026} month={6} />);

    expect(screen.getByText(/まだデータが少ない/)).toBeInTheDocument();
  });

  it("shows skeletons while loading", () => {
    mocked.mockReturnValue(swr(undefined, true));

    render(<InsightCard year={2026} month={6} />);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
