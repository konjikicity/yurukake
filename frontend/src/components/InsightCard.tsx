"use client";

import { useInsights } from "@/hooks/use-insights";
import { toInsightMessages, type InsightTone } from "@/lib/insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  year: number;
  month?: number;
};

const TONE: Record<InsightTone, string> = {
  good: "text-income-text",
  warn: "text-chart-4",
  bad: "text-expense-text",
  neutral: "text-muted-foreground",
};

export default function InsightCard({ year, month }: Props) {
  const { data, isLoading } = useInsights(year, month);
  const messages = toInsightMessages(data?.facts ?? []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">ひとこと</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          <ul className="space-y-2">
            {messages.map((message, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span aria-hidden="true">{message.icon}</span>
                <span className={TONE[message.tone]}>{message.text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
