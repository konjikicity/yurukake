import useSWR from "swr";
import api from "@/lib/api";
import type { User } from "@/lib/auth";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useUser() {
  return useSWR<User>("/api/user", fetcher);
}
