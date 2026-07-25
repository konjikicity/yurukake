import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataImportDialog from "@/components/DataImportDialog";
import api from "@/lib/api";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const mockedPost = api.post as jest.Mock;

const file = () => new File(["type,year,month,name,amount,category\n"], "a.csv", { type: "text/csv" });

async function selectFile(user: ReturnType<typeof userEvent.setup>) {
  await user.upload(screen.getByLabelText("CSVファイル"), file());
}

describe("DataImportDialog", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it("requires a file before checking", async () => {
    render(<DataImportDialog open onOpenChange={() => {}} onImported={() => {}} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "まず確認する" }));
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("sends a dry run first and reports the row count", async () => {
    mockedPost.mockResolvedValue({ data: { imported: 12, skipped: 0, created_categories: [], errors: [] } });
    render(<DataImportDialog open onOpenChange={() => {}} onImported={() => {}} />);
    const user = userEvent.setup();

    await selectFile(user);
    await user.click(screen.getByRole("button", { name: "まず確認する" }));

    const body = mockedPost.mock.calls[0][1] as FormData;
    expect(mockedPost.mock.calls[0][0]).toBe("/api/import");
    expect(body.get("dry_run")).toBe("1");
    expect(await screen.findByText("12件を取り込めます")).toBeInTheDocument();
  });

  it("lists the offending rows when validation fails", async () => {
    mockedPost.mockRejectedValue({
      response: {
        status: 422,
        data: {
          imported: 0,
          errors: [
            { row: 3, messages: ["month は 1 から 12 の間で指定してください"] },
            { row: 5, messages: ["amount は整数で指定してください"] },
          ],
        },
      },
    });
    render(<DataImportDialog open onOpenChange={() => {}} onImported={() => {}} />);
    const user = userEvent.setup();

    await selectFile(user);
    await user.click(screen.getByRole("button", { name: "まず確認する" }));

    expect(await screen.findByText("3行目")).toBeInTheDocument();
    expect(screen.getByText("5行目")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "取り込む" })).not.toBeInTheDocument();
  });

  it("runs the real import after a successful check", async () => {
    mockedPost.mockResolvedValue({ data: { imported: 12, skipped: 1, created_categories: ["娯楽"], errors: [] } });
    const onImported = jest.fn();
    render(<DataImportDialog open onOpenChange={() => {}} onImported={onImported} />);
    const user = userEvent.setup();

    await selectFile(user);
    await user.click(screen.getByRole("button", { name: "まず確認する" }));
    await user.click(await screen.findByRole("button", { name: "取り込む" }));

    const body = mockedPost.mock.calls[1][1] as FormData;
    expect(body.get("dry_run")).toBe("0");
    expect(onImported).toHaveBeenCalled();
  });
});
