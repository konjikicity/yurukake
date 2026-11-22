import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adjacentMonth } from "@/lib/calendar";

type Props = {
  year: number;
  month: number;
};

const ARROW = "inline-flex size-11 items-center justify-center rounded-full text-primary-text hover:bg-muted";

export default function MonthNav({ year, month }: Props) {
  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);

  return (
    <div className="flex items-center gap-1">
      <Link href={`/dashboard/${prev.year}/${prev.month}`} aria-label="前の月" className={ARROW}>
        <ChevronLeft className="size-5" />
      </Link>
      <h2 className="text-2xl font-bold text-foreground tabular-nums">
        {year}年{month}月
      </h2>
      <Link href={`/dashboard/${next.year}/${next.month}`} aria-label="次の月" className={ARROW}>
        <ChevronRight className="size-5" />
      </Link>
    </div>
  );
}
