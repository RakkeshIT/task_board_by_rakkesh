import z from "zod";

export const cardZodSchema = z.object({
    title: z
    .string()
    .trim()
    .min(1, "Title is required"),
})

export type cardSchemaType =  z.infer<typeof cardZodSchema>

