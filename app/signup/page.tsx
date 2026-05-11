import Image from "next/image";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/account");
  }

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft lg:grid-cols-2">
      <div className="flex min-h-[600px] flex-col justify-center p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">New account</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Create your account</h1>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
      <div className="relative hidden min-h-[600px] lg:block">
        <Image src="/images/shop/slide3.jpg" alt="Embroidery design" fill priority className="object-cover" />
      </div>
    </section>
  );
}
