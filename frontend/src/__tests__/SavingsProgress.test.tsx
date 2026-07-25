import { render, screen } from "@testing-library/react";
import SavingsProgress from "@/components/SavingsProgress";
import { useSavingsGoal } from "@/hooks/use-savings-goal";

jest.mock("@/hooks/use-savings-goal");
jest.mock("next/link", () => ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a href={href}>{children}</a>
));

const mockedUse = useSavingsGoal as jest.MockedFunction<typeof useSavingsGoal>;

describe("SavingsProgress", () => {
  it("shows setup prompt when no goal is set", () => {
    mockedUse.mockReturnValue({ data: null, isLoading: false } as ReturnType<typeof useSavingsGoal>);
    render(<SavingsProgress mode="monthly" income={300000} balance={50000} />);
    expect(screen.getByText(/まだ設定されていません/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /マイページで設定する/ })).toHaveAttribute("href", "/mypage");
  });

  it("renders monthly progress for fixed goal", () => {
    mockedUse.mockReturnValue({
      data: { id: 1, user_id: 1, type: "fixed", amount: 50000, percentage: null, created_at: "", updated_at: "" },
      isLoading: false,
    } as ReturnType<typeof useSavingsGoal>);
    render(<SavingsProgress mode="monthly" income={300000} balance={25000} />);
    expect(screen.getByText("25,000円")).toBeInTheDocument();
    expect(screen.getByText("/ 50,000円")).toBeInTheDocument();
    expect(screen.getByText(/達成率 50%/)).toBeInTheDocument();
  });

  it("exposes the progress to assistive technology", () => {
    mockedUse.mockReturnValue({
      data: { id: 1, user_id: 1, type: "fixed", amount: 50000, percentage: null, created_at: "", updated_at: "" },
      isLoading: false,
    } as ReturnType<typeof useSavingsGoal>);
    render(<SavingsProgress mode="monthly" income={300000} balance={25000} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders yearly progress for ratio goal", () => {
    mockedUse.mockReturnValue({
      data: { id: 1, user_id: 1, type: "ratio", amount: null, percentage: 20, created_at: "", updated_at: "" },
      isLoading: false,
    } as ReturnType<typeof useSavingsGoal>);
    render(<SavingsProgress mode="yearly" income={3000000} balance={600000} />);
    expect(screen.getByText("600,000円")).toBeInTheDocument();
    expect(screen.getByText("/ 600,000円")).toBeInTheDocument();
    expect(screen.getByText("目標達成しました")).toBeInTheDocument();
  });

  it("shows negative-balance message", () => {
    mockedUse.mockReturnValue({
      data: { id: 1, user_id: 1, type: "fixed", amount: 50000, percentage: null, created_at: "", updated_at: "" },
      isLoading: false,
    } as ReturnType<typeof useSavingsGoal>);
    render(<SavingsProgress mode="monthly" income={300000} balance={-10000} />);
    expect(screen.getByText("収支がマイナスです")).toBeInTheDocument();
  });
});
