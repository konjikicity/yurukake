import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/components/RegisterForm";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  register: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード確認")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  it("calls register on submit", async () => {
    const { register } = require("@/lib/auth");
    register.mockResolvedValue({ token: "t", user: { id: 1 } });

    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("名前"), "テスト");
    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード確認"), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    expect(register).toHaveBeenCalledWith("テスト", "test@example.com", "password123", "password123");
  });

  it("shows success toast on register", async () => {
    const { register } = require("@/lib/auth");
    register.mockResolvedValue({ token: "t", user: { id: 1 } });

    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("名前"), "テスト");
    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード確認"), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("登録が完了しました");
    });
  });

  it("shows error toast on register failure", async () => {
    const { register } = require("@/lib/auth");
    register.mockRejectedValue(new Error("fail"));

    render(<RegisterForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("名前"), "テスト");
    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.type(screen.getByLabelText("パスワード確認"), "password123");
    await user.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("登録に失敗しました");
    });
  });
});
