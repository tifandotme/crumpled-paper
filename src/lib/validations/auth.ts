import z from "zod"

export const authSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&\-*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long" }),
  phone: z
    .string()
    .min(10, { message: "Phone must be at least 10 characters long" }),
  referral: z.string(),
})

export const signUpSchema = z
  .object({
    name: authSchema.shape.name,
    email: authSchema.shape.email,
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password.optional(),
    address: authSchema.shape.address,
    phone: authSchema.shape.phone,
    referral: authSchema.shape.referral.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: authSchema.shape.email,
  password: authSchema.shape.password,
})
