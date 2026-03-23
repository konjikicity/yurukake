import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  login: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
  });

  it("calls login on submit", async () => {
    const { login } = require("@/lib/auth");
    login.mockResolvedValue({ token: "t", user: { id: 1 } });

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    expect(login).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("shows success toast on login", async () => {
    const { login } = require("@/lib/auth");
    login.mockResolvedValue({ token: "t", user: { id: 1 } });

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("ログインしました");
    });
  });

  it("shows error toast on login failure", async () => {
    const { login } = require("@/lib/auth");
    login.mockRejectedValue(new Error("fail"));

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "password123");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("ログインに失敗しました");
    });
  });

  it("shows field-level validation errors from API", async () => {
    const { login } = require("@/lib/auth");
    const axiosError = {
      response: {
        status: 422,
        data: {
          message: "The given data was invalid.",
          errors: {
            email: ["認証に失敗しました。"],
          },
        },
      },
    };
    login.mockRejectedValue(axiosError);

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(screen.getByText("認証に失敗しました。")).toBeInTheDocument();
    });
  });

  it("clears field errors on resubmit", async () => {
    const { login } = require("@/lib/auth");
    const axiosError = {
      response: {
        status: 422,
        data: {
          message: "The given data was invalid.",
          errors: {
            email: ["認証に失敗しました。"],
          },
        },
      },
    };
    login.mockRejectedValueOnce(axiosError);
    login.mockResolvedValueOnce({ token: "t", user: { id: 1 } });

    render(<LoginForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("メールアドレス"), "test@example.com");
    await user.type(screen.getByLabelText("パスワード"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(screen.getByText("認証に失敗しました。")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "ログイン" }));

    await waitFor(() => {
      expect(screen.queryByText("認証に失敗しました。")).not.toBeInTheDocument();
    });
  });
});
