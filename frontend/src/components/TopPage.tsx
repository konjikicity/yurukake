import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TopPage() {
  return (
    <div>
      <section className="py-20 md:py-32 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          家計管理を、シンプルに、ゆるく。
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          むずかしいことは抜きにして、
          <br className="hidden md:block" />
          収入と支出だけを記録するゆるい家計簿
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full">
            無料ではじめる
          </Button>
        </Link>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            家計管理をゆるくはじめてみませんか？
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="text-4xl">?</div>
                <h3 className="text-lg font-bold">家計簿アプリ、多すぎ問題</h3>
                <p className="text-muted-foreground text-sm">
                  いろんなサービスがあって、いろいろな機能があるけど、よくわからない。
                  結局どれを使えばいいの？機能が多すぎて続かない...
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="text-4xl text-primary">!</div>
                <h3 className="text-lg font-bold">ゆるかけはシンプル</h3>
                <p className="text-muted-foreground text-sm">
                  家計管理がだれでもできる、収入と支出のシンプルなシステム。
                  むずかしい設定も、複雑なカテゴリ分けも必要ありません。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-foreground">つかいかた</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-bold text-lg">アカウント登録</h3>
              <p className="text-muted-foreground text-sm">
                メールアドレスとパスワードだけで、すぐにはじめられます
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-[var(--income)]/20 text-[var(--income)] flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-bold text-lg">収入と支出を記録</h3>
              <p className="text-muted-foreground text-sm">
                項目名と金額を入力するだけ。固定費はテンプレートで一括登録もできます
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-[var(--expense)]/20 text-[var(--expense)] flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-bold text-lg">年間の流れを確認</h3>
              <p className="text-muted-foreground text-sm">
                ダッシュボードで月ごとの収支がひと目でわかります
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
          さっそくはじめてみよう
        </h2>
        <p className="text-muted-foreground mb-8">
          登録は無料。むずかしい設定は一切ありません。
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full">
            無料ではじめる
          </Button>
        </Link>
      </section>
    </div>
  );
}
