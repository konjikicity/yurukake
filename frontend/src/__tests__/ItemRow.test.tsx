import { render, screen } from "@testing-library/react";
import ItemRow from "@/components/ItemRow";

describe("ItemRow", () => {
  it("renders item name and amount", () => {
    render(
      <ItemRow
        id={1}
        name="給料"
        amount={300000}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("給料")).toBeInTheDocument();
    expect(screen.getByText("300,000")).toBeInTheDocument();
  });

  it("shows delete button", () => {
    render(
      <ItemRow
        id={1}
        name="家賃"
        amount={80000}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "削除" })).toBeInTheDocument();
  });
});
