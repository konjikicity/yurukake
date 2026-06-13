import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

const mockPathname = { value: "/" };

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => mockPathname.value,
}));

describe("Header", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
      writable: true,
    });
    mockPathname.value = "/";
  });

  it("renders logo link to top", () => {
    render(<Header />);
    const logo = screen.getByText("ゆるかけ");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  it("shows login button when not logged in", () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    render(<Header />);
    expect(screen.getByRole("link", { name: "ログイン" })).toBeInTheDocument();
  });

  it("marks dashboard link as current on dashboard pages", () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue("token");
    mockPathname.value = "/dashboard/2026/6";
    render(<Header />);
    const dashboardLink = screen.getByRole("link", { name: "ダッシュボード" });
    const mypageLink = screen.getByRole("link", { name: "マイページ" });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");
    expect(mypageLink).not.toHaveAttribute("aria-current");
  });

  it("marks mypage link as current on mypage", () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue("token");
    mockPathname.value = "/mypage";
    render(<Header />);
    const mypageLink = screen.getByRole("link", { name: "マイページ" });
    expect(mypageLink).toHaveAttribute("aria-current", "page");
  });
});
