"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { CategorySummary } from "@/types";

const CHART_COLORS = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);

type Props = {
  data: CategorySummary[];
  title?: string;
};

export default function CategoryPieChart({ data, title }: Props) {
  if (data.length === 0) {
    return (
      <div>
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        <p className="text-muted-foreground text-center py-8">データがありません</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <div className="aspect-square w-full max-w-sm mx-auto sm:aspect-[4/3] sm:max-w-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category_name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              labelLine={false}
              label={({ percent }: { percent?: number }) =>
                (percent ?? 0) >= 0.08 ? `${((percent ?? 0) * 100).toFixed(0)}%` : ""
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category_id ?? `uncategorized-${index}`}
                  fill={entry.category_color ?? CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()}円`} />
            <Legend
              formatter={(value, entry) => {
                const amount = (entry?.payload as { total?: number } | undefined)?.total ?? 0;
                const share = total > 0 ? Math.round((amount / total) * 100) : 0;
                return `${value} ${amount.toLocaleString()}円 (${share}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
