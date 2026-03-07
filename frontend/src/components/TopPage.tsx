import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}

export default function TopPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-24 md:py-36 text-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-[var(--income)]/10" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            かんたん・シンプルな家計簿
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            家計管理を、<br className="md:hidden" />
            <span className="text-primary">シンプル</span>に、<span className="text-[var(--income)]">ゆるく</span>。
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            むずかしいことは抜きにして、
            <br className="hidden md:block" />
            収入と支出だけを記録するゆるい家計簿
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                無料ではじめる
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 rounded-full">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            家計管理をゆるくはじめてみませんか？
          </h2>
          <p className="text-muted-foreground mb-12">
            機能が多すぎる家計簿に疲れたあなたへ
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--expense)]/10 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-[var(--expense)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 15h8" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">家計簿アプリ、多すぎ問題</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  いろんなサービスがあって、いろいろな機能があるけど、よくわからない。
                  結局どれを使えばいいの？機能が多すぎて続かない...
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">ゆるかけはシンプル</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  家計管理がだれでもできる、収入と支出のシンプルなシステム。
                  むずかしい設定も、複雑なカテゴリ分けも必要ありません。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">つかいかた</h2>
          <p className="text-muted-foreground mb-14">3ステップですぐにはじめられます</p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <ShieldIcon className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <h3 className="font-bold text-lg">アカウント登録</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                メールアドレスとパスワードだけで、すぐにはじめられます
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-[var(--income)]/10 text-[var(--income)] flex items-center justify-center mx-auto">
                <WalletIcon className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--income)] text-white text-sm font-bold">
                2
              </div>
              <h3 className="font-bold text-lg">収入と支出を記録</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                項目名と金額を入力するだけ。固定費はテンプレートで一括登録もできます
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-[var(--expense)]/10 text-[var(--expense)] flex items-center justify-center mx-auto">
                <ChartIcon className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--expense)] text-white text-sm font-bold">
                3
              </div>
              <h3 className="font-bold text-lg">年間の流れを確認</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                ダッシュボードで月ごとの収支がひと目でわかります
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-[var(--income)]/10 text-center">
        <div className="max-w-2xl mx-auto">
          <WalletIcon className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            さっそくはじめてみよう
          </h2>
          <p className="text-muted-foreground mb-10">
            登録は無料。むずかしい設定は一切ありません。
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              無料ではじめる
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
