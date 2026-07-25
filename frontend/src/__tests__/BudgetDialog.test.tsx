import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetDialog from "@/components/BudgetDialog";
import api from "@/lib/api";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const mockedPost = api.post as jest.Mock;

describe("BudgetDialog", () => {
  beforeEach(() => {
    mockedPost.mockReset();
    mockedPost.mockResolvedValue({ data: {} });
  });

  it("posts the year, month and amount", async () => {
    const onSaved = jest.fn();
    render(
      <BudgetDialog open year={2026} month={7} budget={null} onOpenChange={() => {}} onSaved={onSaved} />
    );
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("予算（円）"), "160000");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(mockedPost).toHaveBeenCalledWith("/api/monthly-budgets", {
      year: 2026,
      month: 7,
      amount: 160000,
    });
    expect(onSaved).toHaveBeenCalled();
  });

  it("prefills the existing budget", () => {
    render(
      <BudgetDialog open year={2026} month={7} budget={90000} onOpenChange={() => {}} onSaved={() => {}} />
    );
    expect(screen.getByLabelText("予算（円）")).toHaveValue(90000);
  });

  it("does not submit an empty amount", async () => {
    render(
      <BudgetDialog open year={2026} month={7} budget={null} onOpenChange={() => {}} onSaved={() => {}} />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(mockedPost).not.toHaveBeenCalled();
  });
});
