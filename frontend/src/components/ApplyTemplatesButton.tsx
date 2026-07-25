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
      className="border-expense text-expense-text hover:bg-expense hover:text-expense-foreground"
    >
      固定費を一括登録
    </Button>
  );
}
