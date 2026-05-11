"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, createSession, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, quantitySchema, signupSchema } from "@/lib/validation";

type ActionState = {
  error?: string;
};

export async function signupAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check your details." };
  }

  const { fullName, phone, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: { fullName, phone, email, passwordHash },
      select: { id: true }
    });

    await createSession(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An account with this email or phone already exists." };
    }

    return { error: "We could not create your account right now." };
  }

  redirect("/account");
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Please check your login details." };
  }

  const { identifier, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }]
    }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Invalid email, phone number, or password." };
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function addToCartAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = quantitySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect("/products");
  }

  const { productId, quantity } = parsed.data;
  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });

  if (!product) {
    redirect("/products");
  }

  await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId
      }
    },
    update: {
      quantity: { increment: quantity }
    },
    create: {
      userId: user.id,
      productId,
      quantity
    }
  });

  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const itemId = String(formData.get("itemId") || "");
  const quantity = Math.max(Number(formData.get("quantity") || 1), 1);

  await prisma.cartItem.updateMany({
    where: { id: itemId, userId: user.id },
    data: { quantity }
  });

  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const itemId = String(formData.get("itemId") || "");
  await prisma.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
  revalidatePath("/cart");
}

export async function placeOrderAction() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true }
  });

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const totalAmountPaise = cartItems.reduce((sum, item) => sum + item.quantity * item.product.pricePaise, 0);

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        userId: user.id,
        totalAmountPaise,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            pricePaise: item.product.pricePaise,
            quantity: item.quantity
          }))
        }
      }
    });

    await tx.cartItem.deleteMany({ where: { userId: user.id } });
  });

  revalidatePath("/account");
  redirect("/account");
}
