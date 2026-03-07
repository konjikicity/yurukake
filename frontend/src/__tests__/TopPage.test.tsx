import { render, screen } from "@testing-library/react";
import TopPage from "@/components/TopPage";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe("TopPage", () => {
  it("renders hero section", () => {
    render(<TopPage />);
    expect(screen.getByText(/家計管理を、/)).toBeInTheDocument();
  });

  it("renders service description section", () => {
    render(<TopPage />);
    expect(screen.getByText("家計管理をゆるくはじめてみませんか？")).toBeInTheDocument();
  });

  it("renders how to use section", () => {
    render(<TopPage />);
    expect(screen.getByText("つかいかた")).toBeInTheDocument();
  });

  it("has a call to action link", () => {
    render(<TopPage />);
    const cta = screen.getAllByRole("link", { name: /はじめる/ });
    expect(cta.length).toBeGreaterThan(0);
  });
});
