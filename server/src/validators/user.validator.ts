import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6).optional(),
    role: z.enum(["ADMIN", "SELLER", "CUSTOMER"]).optional(),
    profileImage: z.string().optional(),
    providers: z
      .array(
        z.object({
          type: z
            .enum(["credentials", "google", "facebook"])
            .default("credentials"),
          providerId: z.string().min(2),
        })
      )
      .optional(),
  }),
});
