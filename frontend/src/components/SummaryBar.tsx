type Props = {
  income: number;
  expense: number;
};

export default function SummaryBar({ income, expense }: Props) {
  const balance = income - expense;

  return (
    <div className="flex flex-col sm:flex-row justify-around items-center gap-4 p-4 rounded-2xl bg-card border border-border">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">収入合計</p>
        <p className="text-xl font-bold text-[var(--income)]">{income.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">支出合計</p>
        <p className="text-xl font-bold text-[var(--expense)]">{expense.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">収支</p>
        <p className={`text-xl font-bold ${balance < 0 ? "text-[var(--expense)]" : "text-primary"}`}>
          {balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
