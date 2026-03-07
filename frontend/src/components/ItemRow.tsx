"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  id: number;
  name: string;
  amount: number;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, amount: number) => void;
};

export default function ItemRow({ id, name, amount, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount.toString());

  const handleSave = () => {
    onUpdate(id, editName, Number(editAmount));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1"
        />
        <Input
          type="number"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          className="w-32"
        />
        <Button size="sm" onClick={handleSave}>保存</Button>
        <Button size="sm" variant="outline" onClick={() => setEditing(false)}>取消</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="cursor-pointer" onClick={() => setEditing(true)}>
        {name}
      </span>
      <div className="flex items-center gap-3">
        <span className="font-bold">{amount.toLocaleString()}</span>
        <Button size="sm" variant="destructive" onClick={() => onDelete(id)}>
          削除
        </Button>
      </div>
    </div>
  );
}
