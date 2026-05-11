import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(query
        ? {
            OR: [
              { name: { contains: query } },
              { category: { contains: query } },
              { description: { contains: query } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Catalog</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">Products and services</h1>
        </div>
        <form className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="focus-ring w-full rounded-md border border-stone-300 bg-white py-3 pl-10 pr-4" name="q" defaultValue={query} placeholder="Search products" />
        </form>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">No products found.</div>
      )}
    </div>
  );
}
