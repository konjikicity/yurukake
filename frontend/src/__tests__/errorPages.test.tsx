import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "@/app/not-found";
import ErrorPage from "@/app/error";

jest.mock("next/link", () => ({
  __esModule: true,
  default: function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  },
}));

describe("not-found page", () => {
  it("explains the situation and links back to the dashboard", () => {
    render(<NotFound />);
    expect(screen.getByText("ページが見つかりません")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ダッシュボードへ" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
  });
});

describe("error page", () => {
  it("shows a retry button that calls reset", async () => {
    const reset = jest.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);
    const user = userEvent.setup();

    expect(screen.getByText("うまく読み込めませんでした")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "もう一度ためす" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("does not leak the raw error message to the page", () => {
    render(<ErrorPage error={new Error("SQLSTATE[42S02] secret table")} reset={jest.fn()} />);
    expect(screen.queryByText(/SQLSTATE/)).not.toBeInTheDocument();
  });
});
