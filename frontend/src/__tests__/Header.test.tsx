import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/",
}));

describe("Header", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
      writable: true,
    });
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
});
