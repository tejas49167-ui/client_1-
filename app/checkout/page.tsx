import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { placeOrderAction } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cart = await getCart(user.id);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Checkout</p>
        <h1 className="mt-1 text-3xl font-bold text-ink">Review your order</h1>
        <div className="mt-6 grid gap-3">
          {cart.items.map((item) => (
            <div key={item.id} className="grid grid-cols-[72px_1fr_auto] gap-4 border-b border-stone-100 pb-3 last:border-0">
              <div className="relative aspect-square overflow-hidden rounded-md bg-stone-100">
                <Image src={item.product.imagePath} alt={item.product.name} fill className="object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-ink">{item.product.name}</h2>
                <p className="text-sm text-stone-600">Qty {item.quantity}</p>
              </div>
              <strong>{formatMoney(item.quantity * item.product.pricePaise)}</strong>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-ink">Customer</h2>
        <div className="mt-3 rounded-md bg-stone-50 p-4 text-sm text-stone-700">
          <p className="font-semibold text-ink">{user.fullName}</p>
          <p>{user.email}</p>
          <p>{user.phone}</p>
        </div>
        <div className="mt-5 flex justify-between border-t border-stone-200 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatMoney(cart.totalAmountPaise)}</span>
        </div>
        <form action={placeOrderAction} className="mt-6 grid gap-3">
          <SubmitButton>Place order</SubmitButton>
          <Link href="/cart" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 px-5 py-3 font-semibold">
            Back to cart
          </Link>
        </form>
      </aside>
    </div>
  );
}
