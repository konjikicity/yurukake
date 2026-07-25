"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <h1 className="text-xl font-bold">うまく読み込めませんでした</h1>
      <p className="text-sm text-muted-foreground">
        少し時間をおいて、もう一度ためしてみてください。
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>もう一度ためす</Button>
        <Link href="/dashboard">
          <Button variant="outline">ダッシュボードへ</Button>
        </Link>
      </div>
    </div>
  );
}
