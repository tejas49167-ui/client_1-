import { prisma } from "@/lib/prisma";

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { updatedAt: "desc" }
  });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmountPaise = items.reduce((sum, item) => sum + item.quantity * item.product.pricePaise, 0);

  return { items, count, totalAmountPaise };
}
