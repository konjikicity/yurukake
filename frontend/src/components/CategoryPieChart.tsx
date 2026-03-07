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

const COLORS = [
  "#ff9800", "#2196f3", "#4caf50", "#e91e63",
  "#9c27b0", "#00bcd4", "#ff5722", "#607d8b",
  "#795548", "#3f51b5",
];

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

  return (
    <div>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category_name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ category_name, percent }) =>
              `${category_name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString()} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
