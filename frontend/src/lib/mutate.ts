import { toast } from "sonner";

type Options = {
  success?: string;
  error?: string;
  onDone?: () => void;
};

function messageFrom(e: unknown, fallback?: string): string {
  const data = (e as { response?: { data?: { message?: unknown } } })?.response?.data;
  if (typeof data?.message === "string" && data.message !== "") return data.message;
  return fallback ?? "うまくいきませんでした";
}

export async function runMutation<T>(
  fn: () => Promise<T>,
  { success, error, onDone }: Options
): Promise<T | undefined> {
  try {
    const result = await fn();
    if (success) toast.success(success);
    return result;
  } catch (e) {
    toast.error(messageFrom(e, error));
    return undefined;
  } finally {
    onDone?.();
  }
}
