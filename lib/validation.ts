import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    phone: z.string().trim().min(8, "Enter a valid phone number.").max(20, "Phone number is too long."),
    email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your email or phone number.").toLowerCase(),
  password: z.string().min(1, "Enter your password.")
});

export const quantitySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99).default(1)
});
