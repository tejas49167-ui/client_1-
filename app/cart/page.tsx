import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeCartItemAction, updateCartItemAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cart = await getCart(user.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="grid gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Shopping cart</p>
          <h1 className="mt-1 text-3xl font-bold text-ink">{cart.count} item{cart.count === 1 ? "" : "s"}</h1>
        </div>
        {cart.items.length > 0 ? (
          <div className="grid gap-3">
            {cart.items.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-stone-100">
                  <Image src={item.product.imagePath} alt={item.product.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-leaf">{item.product.category}</p>
                  <h2 className="mt-1 font-semibold text-ink">{item.product.name}</h2>
                  <p className="mt-2 text-sm text-stone-600">{formatMoney(item.product.pricePaise)} each</p>
                </div>
                <div className="grid gap-3 sm:min-w-40">
                  <form action={updateCartItemAction} className="flex items-center rounded-md border border-stone-300 bg-white">
                    <input type="hidden" name="itemId" value={item.id} />
                    <button className="grid h-11 w-10 place-items-center" name="quantity" value={Math.max(item.quantity - 1, 1)} aria-label="Decrease quantity">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="grid h-11 min-w-10 place-items-center border-x border-stone-300 px-3 font-semibold">{item.quantity}</span>
                    <button className="grid h-11 w-10 place-items-center" name="quantity" value={item.quantity + 1} aria-label="Increase quantity">
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>
                  <form action={removeCartItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <button className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-vermilion hover:bg-red-50" type="submit">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </form>
                  <strong>{formatMoney(item.quantity * item.product.pricePaise)}</strong>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-stone-200 bg-white p-8 text-center">
            <p className="text-stone-600">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-flex rounded-md bg-marigold px-5 py-3 font-bold text-ink">
              Browse products
            </Link>
          </div>
        )}
      </section>

      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Order summary</h2>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span>Items</span>
            <span>{cart.count}</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold">
            <span>Total</span>
            <span>{formatMoney(cart.totalAmountPaise)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className={`focus-ring mt-6 flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-semibold ${
            cart.items.length > 0 ? "bg-ink text-white hover:bg-stone-800" : "pointer-events-none bg-stone-200 text-stone-500"
          }`}
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
