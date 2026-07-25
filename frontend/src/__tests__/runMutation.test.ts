import { runMutation } from "@/lib/mutate";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("runMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the resolved value and runs onDone", async () => {
    const onDone = jest.fn();
    const result = await runMutation(() => Promise.resolve("ok"), { onDone });

    expect(result).toBe("ok");
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows a success toast only when a message is given", async () => {
    await runMutation(() => Promise.resolve(1), {});
    expect(toast.success).not.toHaveBeenCalled();

    await runMutation(() => Promise.resolve(1), { success: "ほぞんしました" });
    expect(toast.success).toHaveBeenCalledWith("ほぞんしました");
  });

  it("swallows the rejection and shows an error toast instead of throwing", async () => {
    const onDone = jest.fn();
    const result = await runMutation(() => Promise.reject(new Error("boom")), { onDone });

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("prefers the server message from an axios error response", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { data: { message: "みつかりませんでした" } },
    };
    await runMutation(() => Promise.reject(axiosError), {});

    expect(toast.error).toHaveBeenCalledWith("みつかりませんでした");
  });

  it("falls back to the given error message, then to a default", async () => {
    await runMutation(() => Promise.reject(new Error("boom")), { error: "ほぞんできませんでした" });
    expect(toast.error).toHaveBeenCalledWith("ほぞんできませんでした");

    jest.clearAllMocks();
    await runMutation(() => Promise.reject(new Error("boom")), {});
    expect(toast.error).toHaveBeenCalledWith("うまくいきませんでした");
  });
});
