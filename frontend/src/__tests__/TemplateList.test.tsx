import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TemplateList from "@/components/TemplateList";

const mockTemplates = [
  { id: 1, name: "家賃", amount: 80000, category_id: null },
  { id: 2, name: "通信費", amount: 5000, category_id: null },
];

describe("TemplateList", () => {
  it("renders template items", () => {
    render(
      <TemplateList
        templates={mockTemplates}
        categories={[]}
        onAdd={jest.fn()}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    expect(screen.getByText("家賃")).toBeInTheDocument();
    expect(screen.getByText("80,000")).toBeInTheDocument();
    expect(screen.getByText("通信費")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  it("calls onAdd when adding a template", async () => {
    const onAdd = jest.fn();
    render(
      <TemplateList
        templates={[]}
        categories={[]}
        onAdd={onAdd}
        onDelete={jest.fn()}
        onUpdate={jest.fn()}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("項目名"), "保険料");
    await user.type(screen.getByPlaceholderText("金額"), "10000");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledWith("保険料", 10000, undefined);
  });

  it("calls onDelete when deleting a template", async () => {
    const onDelete = jest.fn();
    render(
      <TemplateList
        templates={[{ id: 1, name: "家賃", amount: 80000, category_id: null }]}
        categories={[]}
        onAdd={jest.fn()}
        onDelete={onDelete}
        onUpdate={jest.fn()}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
