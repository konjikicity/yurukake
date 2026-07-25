"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategorySeries, CategoryYearlySummary } from "@/types";

type Props = {
  data: CategoryYearlySummary | undefined;
  isLoading?: boolean;
};

const fallbackColor = (index: number) => `var(--chart-${(index % 8) + 1})`;

function axes(series: CategorySeries[]) {
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
      <XAxis dataKey="month" tickFormatter={(m) => `${m}月`} tickLine={false} axisLine={false} fontSize={12} />
      <YAxis
        tickLine={false}
        axisLine={false}
        fontSize={12}
        width={48}
        tickFormatter={(v) => (v >= 10000 ? `${Math.round(v / 10000)}万` : String(v))}
      />
      <Tooltip
        formatter={(value, name) => [`${Number(value).toLocaleString()}円`, name]}
        labelFormatter={(m) => `${m}月`}
      />
      <Legend formatter={(key) => series.find((s) => s.key === key)?.name ?? key} />
    </>
  );
}

export default function CategoryYearChart({ data, isLoading }: Props) {
  if (isLoading) {
    return <Skeleton className="aspect-[4/3] w-full rounded-xl md:aspect-[16/7]" />;
  }

  const series = data?.series ?? [];

  if (series.length === 0) {
    return <p className="text-muted-foreground text-center py-8">データがありません</p>;
  }

  return (
    <Tabs defaultValue="stacked">
      <TabsList>
        <TabsTrigger value="stacked">積み上げ</TabsTrigger>
        <TabsTrigger value="line">折れ線</TabsTrigger>
      </TabsList>

      <TabsContent value="stacked">
        <div className="aspect-[4/3] w-full md:aspect-[16/7]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              {axes(series)}
              {series.map((s, i) => (
                <Bar
                  key={s.key}
                  dataKey={s.key}
                  name={s.key}
                  stackId="a"
                  fill={s.color ?? fallbackColor(i)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="line">
        <div className="aspect-[4/3] w-full md:aspect-[16/7]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              {axes(series)}
              {series.map((s, i) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.key}
                  stroke={s.color ?? fallbackColor(i)}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}
