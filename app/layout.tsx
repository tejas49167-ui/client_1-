import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, UserRound } from "lucide-react";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Lakshmi Embroidery",
  description: "Embroidery, tailoring, cart, and ordering experience for Lakshmi Embroidery.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const cart = user ? await getCart(user.id) : { count: 0 };

  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur">
          <div className="overflow-hidden bg-ink py-2 text-sm font-semibold text-white">
            <div className="announcement-marquee whitespace-nowrap">
              <span className="mx-8 inline-block">Still in large phase of development, this is half constructed thing</span>
              <span className="mx-8 inline-block" aria-hidden="true">
                Still in large phase of development, this is half constructed thing
              </span>
            </div>
          </div>
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-3 font-semibold text-ink">
              <Image src="/images/shop/logo.jpeg" alt="Lakshmi Embroidery" width={44} height={44} className="h-11 w-11 rounded-md object-cover" priority />
              <span>Lakshmi Embroidery</span>
            </Link>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Link className="rounded-md px-3 py-2 text-stone-700 hover:bg-stone-100" href="/products">
                Products
              </Link>
              <Link className="relative rounded-md p-2 text-stone-700 hover:bg-stone-100" href="/cart" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cart.count > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-vermilion px-1 text-xs text-white">
                    {cart.count}
                  </span>
                ) : null}
              </Link>
              <Link className="rounded-md p-2 text-stone-700 hover:bg-stone-100" href={user ? "/account" : "/login"} aria-label="Account">
                <UserRound className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto min-h-[calc(100vh-73px)] max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
