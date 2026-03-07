import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApplyTemplatesButton from "@/components/ApplyTemplatesButton";

describe("ApplyTemplatesButton", () => {
  it("renders the button", () => {
    render(<ApplyTemplatesButton onApply={jest.fn()} />);
    expect(screen.getByRole("button", { name: "固定費を一括登録" })).toBeInTheDocument();
  });

  it("calls onApply when clicked", async () => {
    const onApply = jest.fn();
    render(<ApplyTemplatesButton onApply={onApply} />);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "固定費を一括登録" }));

    expect(onApply).toHaveBeenCalled();
  });
});
