"use server";

import { auth } from "@/lib/auth";
import { container } from "@/lib/api/container";
import { todoSchema, todoUpdateSchema } from "@/lib/validations/todo";
import { revalidatePath } from "next/cache";

/**
 * Server Actions — TODO 操作
 *
 * API Route の代替として使用できる。
 * フォームの progressive enhancement やクライアントからの直接呼び出しに対応。
 *
 * @example
 * // Client Component から呼び出す
 * import { createTodo } from "@/lib/actions/todo-actions";
 * await createTodo({ title: "新しいタスク" });
 *
 * @example
 * // form の action 属性で使う（progressive enhancement）
 * <form action={createTodo}>
 *   <input name="title" />
 *   <button type="submit">追加</button>
 * </form>
 */

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("未認証");
  }
  return session.user.id;
}

export async function createTodo(input: { title: string }) {
  const userId = await getAuthUserId();
  const { title } = todoSchema.parse(input);
  const todo = await container.todos.create(userId, title);
  revalidatePath("/dashboard");
  return { todo };
}

export async function updateTodo(id: number, input: { title?: string; completed?: boolean }) {
  const userId = await getAuthUserId();
  const data = todoUpdateSchema.parse(input);
  const todo = await container.todos.update(id, userId, data);
  revalidatePath("/dashboard");
  return { todo };
}

export async function deleteTodo(id: number) {
  const userId = await getAuthUserId();
  await container.todos.delete(id, userId);
  revalidatePath("/dashboard");
  return { success: true };
}
