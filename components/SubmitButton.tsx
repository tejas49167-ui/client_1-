"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
