export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
          <span className="font-bold text-primary">ゆるかけ</span>
        </div>
        <p className="text-sm text-muted-foreground">ゆるい家計簿</p>
      </div>
    </footer>
  );
}
