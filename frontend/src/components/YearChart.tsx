"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { MonthlySummary } from "@/types";

type Props = {
  data: MonthlySummary[];
};

export default function YearChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: `${d.month}月`,
    income: d.income,
    expense: d.expense,
  }));

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">年間推移</h3>
      <div className="aspect-[4/3] w-full md:aspect-[16/7]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              width={48}
              tickFormatter={(v) => (v >= 10000 ? `${Math.round(v / 10000)}万` : String(v))}
            />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()}円`} />
            <Legend />
            <Bar dataKey="income" name="収入" fill="var(--income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="支出" fill="var(--expense)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
