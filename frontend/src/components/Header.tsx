"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          ゆるかけ
        </Link>
        <nav className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">ダッシュボード</Button>
              </Link>
              <Link href="/mypage">
                <Button variant="outline" size="sm">マイページ</Button>
              </Link>
            </>
          ) : (
            !isAuthPage && (
              <Link href="/login">
                <Button size="sm">ログイン</Button>
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
