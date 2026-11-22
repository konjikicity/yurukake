import { Badge } from "@/components/ui/badge";
import type { BudgetLevel } from "@/lib/budget";

export default function BudgetBadge({ level }: { level: BudgetLevel }) {
  if (level === "over") {
    return (
      <Badge variant="secondary" className="bg-expense/20 text-expense-text">
        ちょっと使いすぎ
      </Badge>
    );
  }
  if (level === "warn") {
    return <Badge variant="secondary">のこりわずか</Badge>;
  }
  return null;
}
