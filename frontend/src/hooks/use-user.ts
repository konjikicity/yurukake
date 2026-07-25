import useSWR from "swr";
import type { User } from "@/lib/auth";

export function useUser() {
  return useSWR<User>("/api/user");
}
