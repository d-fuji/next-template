import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
});

export const todoUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください")
    .optional(),
  completed: z.boolean().optional(),
});

export type TodoInput = z.infer<typeof todoSchema>;
export type TodoUpdateInput = z.infer<typeof todoUpdateSchema>;
