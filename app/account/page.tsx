import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [cart, orders] = await Promise.all([
    getCart(user.id),
    prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-ink p-6 text-white shadow-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-marigold">Account</p>
            <h1 className="mt-1 text-3xl font-bold">Hello, {user.fullName}</h1>
            <p className="mt-2 text-stone-300">{user.email} &middot; {user.phone}</p>
          </div>
          <form action={logoutAction}>
            <button className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 font-semibold hover:bg-white/10" type="submit">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric label="Cart items" value={String(cart.count)} />
        <Metric label="Cart total" value={formatMoney(cart.totalAmountPaise)} />
        <Metric label="Orders" value={String(orders.length)} />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-leaf">Orders</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">Order history</h2>
          </div>
          <Link href="/products" className="rounded-md px-3 py-2 text-sm font-semibold text-vermilion hover:bg-red-50">
            Continue shopping
          </Link>
        </div>

        <div className="mt-5 grid gap-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <article key={order.id} className="rounded-md border border-stone-200 p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold text-ink">Order #{order.id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-stone-600">{order.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-bold">{formatMoney(order.totalAmountPaise)}</p>
                    <p className="text-sm capitalize text-leaf">{order.status.toLowerCase()}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-stone-600">{order.items.length} product{order.items.length === 1 ? "" : "s"}</p>
              </article>
            ))
          ) : (
            <div className="rounded-md bg-stone-50 p-6 text-center text-stone-600">No orders yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <strong className="mt-2 block text-2xl text-ink">{value}</strong>
    </div>
  );
}
