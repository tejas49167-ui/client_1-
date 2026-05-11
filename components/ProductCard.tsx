import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { addToCartAction } from "@/app/actions";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-stone-100">
          <Image src={product.imagePath} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-leaf">{product.category}</p>
          <h2 className="mt-1 line-clamp-2 text-base font-semibold text-ink">{product.name}</h2>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong>{formatMoney(product.pricePaise)}</strong>
          <form action={addToCartAction}>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value="1" />
            <button className="focus-ring rounded-md bg-marigold px-3 py-2 text-sm font-bold text-ink hover:bg-amber-400" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
