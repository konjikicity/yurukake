"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useExpenseTemplates } from "@/hooks/use-templates";
import { useCategories } from "@/hooks/use-categories";
import { useSummary } from "@/hooks/use-summary";
import { logout } from "@/lib/auth";
import api from "@/lib/api";
import TemplateList from "@/components/TemplateList";
import CategoryManager from "@/components/CategoryManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: templates, mutate } = useExpenseTemplates();
  const { data: incomeCategories, mutate: mutateIncCat } = useCategories("income");
  const { data: expenseCategories, mutate: mutateExpCat } = useCategories("expense");
  const currentYear = new Date().getFullYear();
  const { data: summary } = useSummary(currentYear);

  const totalIncome = summary?.reduce((s, m) => s + m.income, 0) ?? 0;
  const totalExpense = summary?.reduce((s, m) => s + m.expense, 0) ?? 0;
  const totalBalance = totalIncome - totalExpense;
  const monthsWithData = summary?.filter((m) => m.income > 0 || m.expense > 0).length ?? 0;
  const avgExpense = monthsWithData > 0 ? Math.round(totalExpense / monthsWithData) : 0;

  const handleAdd = async (name: string, amount: number, categoryId?: number) => {
    await api.post("/api/expense-templates", { name, amount, category_id: categoryId ?? null });
    mutate();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/api/expense-templates/${id}`);
    mutate();
  };

  const handleUpdate = async (id: number, name: string, amount: number) => {
    await api.put(`/api/expense-templates/${id}`, { name, amount });
    mutate();
  };

  const handleAddIncomeCategory = async (name: string, color: string) => {
    await api.post("/api/categories", { type: "income", name, color });
    mutateIncCat();
  };

  const handleAddExpenseCategory = async (name: string, color: string) => {
    await api.post("/api/categories", { type: "expense", name, color });
    mutateExpCat();
  };

  const handleDeleteCategory = async (id: number) => {
    await api.delete(`/api/categories/${id}`);
    mutateIncCat();
    mutateExpCat();
  };

  const handleUpdateCategory = async (id: number, name: string, color: string) => {
    await api.put(`/api/categories/${id}`, { name, color });
    mutateIncCat();
    mutateExpCat();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0) ?? "?"}
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{user?.name ?? "---"}</p>
              <p className="text-sm text-muted-foreground">{user?.email ?? "---"}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            ログアウト
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">{currentYear}年の収支サマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">収入合計</p>
              <p className="text-lg font-bold text-[var(--income)]">{totalIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">支出合計</p>
              <p className="text-lg font-bold text-[var(--expense)]">{totalExpense.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">収支</p>
              <p className={`text-lg font-bold ${totalBalance < 0 ? "text-[var(--expense)]" : "text-primary"}`}>
                {totalBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">月平均支出</p>
              <p className="text-lg font-bold text-muted-foreground">{avgExpense.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--expense)]">固定費テンプレート</CardTitle>
            <p className="text-sm text-muted-foreground">
              毎月の固定費を登録しておくと、月の詳細画面から一括で追加できます
            </p>
          </CardHeader>
          <CardContent>
            <TemplateList
              templates={templates ?? []}
              categories={expenseCategories ?? []}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--income)]">収入カテゴリー</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryManager
              categories={incomeCategories ?? []}
              type="income"
              onAdd={handleAddIncomeCategory}
              onDelete={handleDeleteCategory}
              onUpdate={handleUpdateCategory}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[var(--expense)]">支出カテゴリー</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryManager
              categories={expenseCategories ?? []}
              type="expense"
              onAdd={handleAddExpenseCategory}
              onDelete={handleDeleteCategory}
              onUpdate={handleUpdateCategory}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
