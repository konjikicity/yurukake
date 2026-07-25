"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate as globalMutate } from "swr";
import { Upload } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useExpenseTemplates } from "@/hooks/use-templates";
import { useCategories } from "@/hooks/use-categories";
import { useSummary } from "@/hooks/use-summary";
import { logout } from "@/lib/auth";
import { runMutation } from "@/lib/mutate";
import api from "@/lib/api";
import TemplateList from "@/components/TemplateList";
import CategoryManager from "@/components/CategoryManager";
import SavingsGoalSettings from "@/components/SavingsGoalSettings";
import DataExportButton from "@/components/DataExportButton";
import DataImportDialog from "@/components/DataImportDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyPage() {
  const router = useRouter();
  const [importOpen, setImportOpen] = useState(false);
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

  const mutateCategories = () => {
    mutateIncCat();
    mutateExpCat();
  };

  const handleAdd = (name: string, amount: number, categoryId?: number) =>
    runMutation(
      () => api.post("/api/expense-templates", { name, amount, category_id: categoryId ?? null }),
      { error: "固定費を追加できませんでした", onDone: mutate }
    );

  const handleDelete = (id: number) =>
    runMutation(() => api.delete(`/api/expense-templates/${id}`), {
      error: "固定費を削除できませんでした",
      onDone: mutate,
    });

  const handleUpdate = (id: number, name: string, amount: number) =>
    runMutation(() => api.put(`/api/expense-templates/${id}`, { name, amount }), {
      error: "固定費を更新できませんでした",
      onDone: mutate,
    });

  const handleAddIncomeCategory = (name: string, color: string) =>
    runMutation(() => api.post("/api/categories", { type: "income", name, color }), {
      error: "カテゴリーを追加できませんでした",
      onDone: mutateIncCat,
    });

  const handleAddExpenseCategory = (name: string, color: string) =>
    runMutation(() => api.post("/api/categories", { type: "expense", name, color }), {
      error: "カテゴリーを追加できませんでした",
      onDone: mutateExpCat,
    });

  const handleDeleteCategory = (id: number) =>
    runMutation(() => api.delete(`/api/categories/${id}`), {
      error: "カテゴリーを削除できませんでした",
      onDone: mutateCategories,
    });

  const handleUpdateCategory = (id: number, name: string, color: string) =>
    runMutation(() => api.put(`/api/categories/${id}`, { name, color }), {
      error: "カテゴリーを更新できませんでした",
      onDone: mutateCategories,
    });

  const handleLogout = () =>
    runMutation(() => logout(), {
      error: "ログアウトできませんでした",
      onDone: () => router.push("/login"),
    });

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary-text">
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
              <p className="text-lg font-bold text-income-text">{totalIncome.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">支出合計</p>
              <p className="text-lg font-bold text-expense-text">{totalExpense.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">収支</p>
              <p className={`text-lg font-bold ${totalBalance < 0 ? "text-expense-text" : "text-primary-text"}`}>
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

      <Tabs defaultValue="goal">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="goal" className="min-h-11">貯金目標</TabsTrigger>
          <TabsTrigger value="templates" className="min-h-11">固定費</TabsTrigger>
          <TabsTrigger value="categories" className="min-h-11">カテゴリー</TabsTrigger>
          <TabsTrigger value="data" className="min-h-11">データ管理</TabsTrigger>
        </TabsList>

        <TabsContent value="goal">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-text">貯金目標</CardTitle>
            </CardHeader>
            <CardContent>
              <SavingsGoalSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle className="text-expense-text">固定費テンプレート</CardTitle>
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-income-text">収入カテゴリー</CardTitle>
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
              <CardTitle className="text-expense-text">支出カテゴリー</CardTitle>
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
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>データの書き出し・取り込み</CardTitle>
              <p className="text-sm text-muted-foreground">
                CSVで持ち出したり、他のアプリからまとめて取り込めます
              </p>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <DataExportButton year={currentYear} />
              <Button variant="outline" onClick={() => setImportOpen(true)}>
                <Upload className="size-4" />
                CSVを取り込む
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DataImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => {
          mutate();
          mutateCategories();
          globalMutate((key) => typeof key === "string" && key.startsWith("/api/"));
        }}
      />
    </div>
  );
}
