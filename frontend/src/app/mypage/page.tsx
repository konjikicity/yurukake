"use client";

import { useRouter } from "next/navigation";
import { useExpenseTemplates } from "@/hooks/use-templates";
import { useCategories } from "@/hooks/use-categories";
import { logout } from "@/lib/auth";
import api from "@/lib/api";
import TemplateList from "@/components/TemplateList";
import CategoryManager from "@/components/CategoryManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyPage() {
  const router = useRouter();
  const { data: templates, mutate } = useExpenseTemplates();
  const { data: incomeCategories, mutate: mutateIncCat } = useCategories("income");
  const { data: expenseCategories, mutate: mutateExpCat } = useCategories("expense");

  const handleAdd = async (name: string, amount: number) => {
    await api.post("/api/expense-templates", { name, amount });
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">マイページ</h2>
        <Button variant="outline" onClick={handleLogout}>
          ログアウト
        </Button>
      </div>

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
