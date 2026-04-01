import { container } from "@/lib/api/container";
import { createHandler } from "@/lib/api/handler";
import { todoUpdateSchema } from "@/lib/validations/todo";

/** TODO 更新 */
export const PATCH = createHandler()
  .withAuth()
  .withBody(todoUpdateSchema)
  .handle(async ({ userId, body, params }) => {
    const id = Number(params.id);
    const todo = await container.todos.update(id, userId, body);
    return { todo };
  });

/** TODO 削除 */
export const DELETE = createHandler()
  .withAuth()
  .handle(async ({ userId, params }) => {
    const id = Number(params.id);
    await container.todos.delete(id, userId);
    return { success: true };
  });
