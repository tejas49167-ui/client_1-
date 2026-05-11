"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { loginAction, signupAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm() {
  const [state, action] = useFormState(loginAction, {});

  return (
    <form action={action} className="grid gap-4">
      <AuthError message={state.error} />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="identifier" placeholder="Email or phone number" autoComplete="username" required />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="password" type="password" placeholder="Password" autoComplete="current-password" required />
      <SubmitButton>Login</SubmitButton>
      <p className="text-sm text-stone-600">
        Do not have an account?{" "}
        <Link href="/signup" className="font-semibold text-vermilion">
          Register
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useFormState(signupAction, {});

  return (
    <form action={action} className="grid gap-4">
      <AuthError message={state.error} />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="fullName" placeholder="Full name" autoComplete="name" required />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="phone" placeholder="Phone number" autoComplete="tel" required />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="password" type="password" placeholder="Create password" autoComplete="new-password" required />
      <input className="focus-ring rounded-md border border-stone-300 bg-white px-4 py-3" name="confirmPassword" type="password" placeholder="Confirm password" autoComplete="new-password" required />
      <SubmitButton>Create account</SubmitButton>
      <p className="text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-vermilion">
          Login
        </Link>
      </p>
    </form>
  );
}

function AuthError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}
