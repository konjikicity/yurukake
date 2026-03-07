import { render, screen } from "@testing-library/react";
import YearSelector from "@/components/YearSelector";

describe("YearSelector", () => {
  it("renders with current year", () => {
    const onChange = jest.fn();
    render(<YearSelector year={2026} onChange={onChange} />);
    expect(screen.getByDisplayValue("2026")).toBeInTheDocument();
  });
});
