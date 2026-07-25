"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";

type ImportError = { row: number; messages: string[] };

type ImportResult = {
  imported: number;
  skipped: number;
  created_categories: string[];
  errors: ImportError[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
};

function ImportForm({ onOpenChange, onImported }: Omit<Props, "open">) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("append");
  const [createCategories, setCreateCategories] = useState(true);
  const [checked, setChecked] = useState<ImportResult | null>(null);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [busy, setBusy] = useState(false);

  const send = async (dryRun: boolean) => {
    if (!file) return;

    const body = new FormData();
    body.append("file", file);
    body.append("mode", mode);
    body.append("create_categories", createCategories ? "1" : "0");
    body.append("dry_run", dryRun ? "1" : "0");

    setBusy(true);
    setErrors([]);

    try {
      const response = await api.post("/api/import", body);
      const result = response.data as ImportResult;

      if (dryRun) {
        setChecked(result);
      } else {
        toast.success(`${result.imported}件を取り込みました`);
        onImported();
        onOpenChange(false);
      }
    } catch (e) {
      const data = (e as { response?: { data?: ImportResult } }).response?.data;
      setChecked(null);
      if (data?.errors?.length) {
        setErrors(data.errors);
      } else {
        toast.error("取り込みに失敗しました");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>CSVを取り込む</DialogTitle>
        <DialogDescription>
          書き出したCSVと同じ形式です。まず内容を確認してから取り込みます。
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="import-file">CSVファイル</Label>
          <Input
            id="import-file"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setChecked(null);
              setErrors([]);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="import-mode">取り込みかた</Label>
          <select
            id="import-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            <option value="append">今のデータに追加する</option>
            <option value="replace">CSVにある月を置きかえる</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={createCategories}
            onChange={(e) => setCreateCategories(e.target.checked)}
          />
          知らないカテゴリーは新しく作る
        </label>

        {checked && (
          <p className="rounded-lg bg-accent p-3 text-sm">
            {checked.imported}件を取り込めます
            {checked.created_categories.length > 0 &&
              `（カテゴリー ${checked.created_categories.join("、")} を作ります）`}
          </p>
        )}

        {errors.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-destructive">
              取り込めない行があります。直してからもう一度おためしください。
            </p>
            <div className="max-h-48 overflow-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">場所</TableHead>
                    <TableHead>内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errors.map((error) => (
                    <TableRow key={error.row}>
                      <TableCell>{error.row}行目</TableCell>
                      <TableCell>{error.messages.join(" / ")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          キャンセル
        </Button>
        <Button variant="outline" onClick={() => send(true)} disabled={busy}>
          まず確認する
        </Button>
        {checked && (
          <Button onClick={() => send(false)} disabled={busy}>
            取り込む
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

export default function DataImportDialog({ open, onOpenChange, onImported }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ImportForm onOpenChange={onOpenChange} onImported={onImported} />
      </DialogContent>
    </Dialog>
  );
}
