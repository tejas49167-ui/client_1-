import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2">
      <div className="relative hidden min-h-[560px] lg:block">
        <Image src="/images/shop/slide2.jpg" alt="Tailoring workspace" fill priority className="object-cover" />
      </div>
      <div className="flex min-h-[560px] flex-col justify-center p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Login to your account</h1>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
