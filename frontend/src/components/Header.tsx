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
        <Link href="/" className="text-2xl font-bold text-primary">
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
