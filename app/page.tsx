import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: 4
  });

  return (
    <div className="grid gap-10">
      <section className="grid overflow-hidden rounded-lg bg-ink text-white shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[390px] flex-col justify-center gap-6 p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-marigold">Lakshmi Embroidery</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Premium embroidery and tailoring made easy to order.</h1>
          <p className="max-w-xl text-base leading-7 text-stone-200">
            Browse curated designs, add services to your cart, and place an order with a clean account dashboard for every purchase.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="focus-ring rounded-md bg-marigold px-5 py-3 font-bold text-ink hover:bg-amber-400">
              Shop products
            </Link>
            <Link href="/signup" className="focus-ring rounded-md border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10">
              Create account
            </Link>
          </div>
        </div>
        <div className="relative min-h-[320px]">
          <Image src="/images/shop/slide1.jpg" alt="Embroidery work" fill priority className="object-cover" />
        </div>
      </section>

      <section className="grid gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Featured work</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">Popular services</h2>
          </div>
          <Link href="/products" className="rounded-md px-3 py-2 text-sm font-semibold text-vermilion hover:bg-red-50">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
