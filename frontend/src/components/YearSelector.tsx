"use client";

type Props = {
  year: number;
  onChange: (year: number) => void;
};

export default function YearSelector({ year, onChange }: Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <select
      value={year}
      onChange={(e) => onChange(Number(e.target.value))}
      className="rounded-lg border border-border bg-card px-4 py-2 text-lg font-bold"
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
