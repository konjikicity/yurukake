import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <p className="text-5xl font-bold text-primary-text">404</p>
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <p className="text-sm text-muted-foreground">
        アドレスが変わったか、消えてしまったみたいです。
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard">
          <Button>ダッシュボードへ</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">トップへ</Button>
        </Link>
      </div>
    </div>
  );
}
