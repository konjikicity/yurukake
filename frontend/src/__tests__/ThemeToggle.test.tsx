import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/ThemeToggle";

const mockTheme = { resolvedTheme: "light" as string | undefined, setTheme: jest.fn() };

jest.mock("next-themes", () => ({
  useTheme: () => mockTheme,
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockTheme.resolvedTheme = "light";
    mockTheme.setTheme = jest.fn();
  });

  it("renders a toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "テーマ切り替え" })).toBeInTheDocument();
  });

  it("switches to dark when current theme is light", async () => {
    render(<ThemeToggle />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "テーマ切り替え" }));
    expect(mockTheme.setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light when current theme is dark", async () => {
    mockTheme.resolvedTheme = "dark";
    render(<ThemeToggle />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "テーマ切り替え" }));
    expect(mockTheme.setTheme).toHaveBeenCalledWith("light");
  });

  it("still renders the button before the theme resolves", () => {
    mockTheme.resolvedTheme = undefined;
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: "テーマ切り替え" })).toBeInTheDocument();
  });
});
