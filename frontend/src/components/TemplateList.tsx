"use client";

import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

type Template = {
  id: number;
  name: string;
  amount: number;
};

type Props = {
  templates: Template[];
  onAdd: (name: string, amount: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string, amount: number) => void;
};

export default function TemplateList({ templates, onAdd, onDelete, onUpdate }: Props) {
  return (
    <div className="space-y-3">
      <div>
        {templates.map((t) => (
          <ItemRow
            key={t.id}
            id={t.id}
            name={t.name}
            amount={t.amount}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <AddItemForm onAdd={onAdd} />
    </div>
  );
}
