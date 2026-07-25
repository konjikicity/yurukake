import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav from "@/components/MobileNav";

jest.mock("next/link", () => ({
  __esModule: true,
  default: function MockLink({
    children,
    href,
    ...props
  }: React.ComponentProps<"a"> & { href: string }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

describe("MobileNav", () => {
  it("renders a labelled trigger", () => {
    render(<MobileNav loggedIn={true} activePath="/dashboard" />);
    expect(screen.getByRole("button", { name: "メニュー" })).toBeInTheDocument();
  });

  it("keeps navigation links out of the DOM while closed", () => {
    render(<MobileNav loggedIn={true} activePath="/dashboard" />);
    expect(screen.queryByRole("link", { name: "ダッシュボード" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "マイページ" })).not.toBeInTheDocument();
  });

  it("shows the logged in links once opened", async () => {
    render(<MobileNav loggedIn={true} activePath="/dashboard" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "メニュー" }));

    expect(await screen.findByRole("link", { name: "ダッシュボード" })).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByRole("link", { name: "マイページ" })).toHaveAttribute("href", "/mypage");
  });

  it("shows the login link when logged out", async () => {
    render(<MobileNav loggedIn={false} activePath="/" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "メニュー" }));

    expect(await screen.findByRole("link", { name: "ログイン" })).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: "マイページ" })).not.toBeInTheDocument();
  });

  it("marks the active link with aria-current", async () => {
    render(<MobileNav loggedIn={true} activePath="/mypage" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "メニュー" }));

    expect(await screen.findByRole("link", { name: "マイページ" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "ダッシュボード" })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
