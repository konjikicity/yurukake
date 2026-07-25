"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardActive = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isMypageActive = pathname === "/mypage";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-text hover:opacity-80 transition-opacity">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          ゆるかけ
        </Link>
        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          <nav className="hidden items-center gap-3 md:flex">
            {loggedIn ? (
              <>
                <Link href="/dashboard" aria-current={isDashboardActive ? "page" : undefined}>
                  <Button
                    variant={isDashboardActive ? "default" : "ghost"}
                    size="lg"
                    className={isDashboardActive ? "font-bold" : undefined}
                  >
                    ダッシュボード
                  </Button>
                </Link>
                <Link href="/mypage" aria-current={isMypageActive ? "page" : undefined}>
                  <Button
                    variant={isMypageActive ? "default" : "outline"}
                    size="lg"
                    className={isMypageActive ? "font-bold" : undefined}
                  >
                    マイページ
                  </Button>
                </Link>
              </>
            ) : (
              !isAuthPage && (
                <Link href="/login">
                  <Button size="lg">ログイン</Button>
                </Link>
              )
            )}
          </nav>
          <div className="md:hidden">
            <MobileNav loggedIn={loggedIn} activePath={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
}
