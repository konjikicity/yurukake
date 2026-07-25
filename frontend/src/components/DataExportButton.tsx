"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runMutation } from "@/lib/mutate";
import api from "@/lib/api";

type Props = {
  year: number;
};

export default function DataExportButton({ year }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () =>
    runMutation(
      async () => {
        const response = await api.get(`/api/export?year=${year}`, { responseType: "blob" });
        const url = URL.createObjectURL(response.data as Blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `yurukake_${year}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      },
      {
        error: "書き出しできませんでした",
        onDone: () => setDownloading(false),
      }
    );

  return (
    <Button
      variant="outline"
      onClick={() => {
        setDownloading(true);
        handleDownload();
      }}
      disabled={downloading}
    >
      <Download className="size-4" />
      {year}年のデータを書き出す
    </Button>
  );
}
