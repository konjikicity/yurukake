"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onApply: () => void;
};

export default function ApplyTemplatesButton({ onApply }: Props) {
  return (
    <Button
      onClick={onApply}
      variant="outline"
      className="border-[var(--expense)] text-[var(--expense)] hover:bg-[var(--expense)] hover:text-white"
    >
      固定費を一括登録
    </Button>
  );
}
