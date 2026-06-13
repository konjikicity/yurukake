import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SavingsGoalSettings from "@/components/SavingsGoalSettings";
import { useSavingsGoal } from "@/hooks/use-savings-goal";
import api from "@/lib/api";

jest.mock("@/hooks/use-savings-goal");
jest.mock("@/lib/api", () => ({ __esModule: true, default: { post: jest.fn() } }));

const mockedUse = useSavingsGoal as jest.MockedFunction<typeof useSavingsGoal>;

describe("SavingsGoalSettings", () => {
  beforeEach(() => {
    (api.post as jest.Mock).mockReset();
    (api.post as jest.Mock).mockResolvedValue({ data: {} });
  });

  it("starts in fixed mode with empty amount", () => {
    const mutate = jest.fn();
    mockedUse.mockReturnValue({ data: null, mutate, isLoading: false } as unknown as ReturnType<typeof useSavingsGoal>);
    render(<SavingsGoalSettings />);
    expect(screen.getByLabelText(/月いくら貯めたい/)).toBeInTheDocument();
  });

  it("switches to ratio mode when ratio button is clicked", () => {
    const mutate = jest.fn();
    mockedUse.mockReturnValue({ data: null, mutate, isLoading: false } as unknown as ReturnType<typeof useSavingsGoal>);
    render(<SavingsGoalSettings />);
    fireEvent.click(screen.getByRole("button", { name: "収入比（%）" }));
    expect(screen.getByLabelText(/収入の何%/)).toBeInTheDocument();
  });

  it("submits fixed goal", async () => {
    const mutate = jest.fn().mockResolvedValue(undefined);
    mockedUse.mockReturnValue({ data: null, mutate, isLoading: false } as unknown as ReturnType<typeof useSavingsGoal>);
    render(<SavingsGoalSettings />);
    fireEvent.change(screen.getByLabelText(/月いくら貯めたい/), { target: { value: "50000" } });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/savings-goal", { type: "fixed", amount: 50000 });
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("populates form from existing goal", () => {
    const mutate = jest.fn();
    mockedUse.mockReturnValue({
      data: { id: 1, user_id: 1, type: "ratio", amount: null, percentage: 25, created_at: "", updated_at: "" },
      mutate,
      isLoading: false,
    } as unknown as ReturnType<typeof useSavingsGoal>);
    render(<SavingsGoalSettings />);
    expect((screen.getByLabelText(/収入の何%/) as HTMLInputElement).value).toBe("25");
  });
});
