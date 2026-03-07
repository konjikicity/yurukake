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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => Number(value).toLocaleString()} />
          <Legend />
          <Bar dataKey="income" name="収入" fill="var(--income)" />
          <Bar dataKey="expense" name="支出" fill="var(--expense)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
