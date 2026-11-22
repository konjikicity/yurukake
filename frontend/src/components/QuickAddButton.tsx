"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/use-categories";
import { addItem } from "@/lib/item-actions";
import AddItemForm from "./AddItemForm";

type Props = {
  today?: Date;
};

export default function QuickAddButton({ today = new Date() }: Props) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories("expense");
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const handleAdd = (name: string, amount: number, categoryId?: number) => {
    setOpen(false);
    addItem("expense", { year, month, name, amount, category_id: categoryId ?? null }, "支出を追加しました");
  };

  return (
    <>
      <Button
        size="icon"
        className="fixed right-5 bottom-5 z-40 size-14 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="支出をすばやく追加"
      >
        <Plus className="size-6" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{month}月の支出を追加</DialogTitle>
            <DialogDescription>金額だけでも大丈夫です。</DialogDescription>
          </DialogHeader>
          <AddItemForm onAdd={handleAdd} categories={categories ?? []} autoFocus />
        </DialogContent>
      </Dialog>
    </>
  );
}
