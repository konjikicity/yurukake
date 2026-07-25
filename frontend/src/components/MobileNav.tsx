"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  loggedIn: boolean;
  activePath: string;
};

const LOGGED_IN_LINKS = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/mypage", label: "マイページ" },
];

const LOGGED_OUT_LINKS = [
  { href: "/login", label: "ログイン" },
  { href: "/register", label: "新規登録" },
];

export default function MobileNav({ loggedIn, activePath }: Props) {
  const [open, setOpen] = useState(false);
  const links = loggedIn ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;

  const isActive = (href: string) =>
    href === "/dashboard" ? activePath.startsWith("/dashboard") : activePath === href;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="size-11" aria-label="メニュー">
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-lg px-3 text-base transition-colors ${
                isActive(link.href)
                  ? "bg-accent font-bold text-accent-foreground"
                  : "hover:bg-accent/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
