import useSWR from "swr";
import type { AccountBalance } from "@/types";

export function useAccountBalance() {
  return useSWR<AccountBalance>("/api/account-balance");
}
