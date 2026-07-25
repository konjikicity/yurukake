"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/swr";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>{children}</SWRConfig>
    </ThemeProvider>
  );
}
