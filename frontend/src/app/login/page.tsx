import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md space-y-4">
        <LoginForm />
        <p className="text-center text-sm">
          アカウントがない方は
          <Link href="/register" className="text-primary underline ml-1">
            登録
          </Link>
        </p>
      </div>
    </div>
  );
}
