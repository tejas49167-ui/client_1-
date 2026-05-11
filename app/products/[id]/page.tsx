import Image from "next/image";
import { notFound } from "next/navigation";
import { addToCartAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { slug: params.id, isActive: true }
  });

  if (!product) {
    notFound();
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100 shadow-soft">
        <Image src={product.imagePath} alt={product.name} fill priority className="object-cover" />
      </div>
      <div className="flex flex-col justify-center gap-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">{product.category}</p>
        <h1 className="text-4xl font-bold text-ink">{product.name}</h1>
        <p className="text-lg leading-8 text-stone-700">{product.description}</p>
        <strong className="text-3xl">{formatMoney(product.pricePaise)}</strong>
        <form action={addToCartAction} className="flex max-w-sm gap-3">
          <input type="hidden" name="productId" value={product.id} />
          <input className="focus-ring w-24 rounded-md border border-stone-300 px-3 py-3" name="quantity" type="number" min="1" max="99" defaultValue="1" />
          <SubmitButton className="flex-1">Add to cart</SubmitButton>
        </form>
      </div>
    </section>
  );
}
