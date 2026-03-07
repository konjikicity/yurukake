import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <p className="text-center text-sm">
          アカウントをお持ちの方は
          <Link href="/login" className="text-primary underline ml-1">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
