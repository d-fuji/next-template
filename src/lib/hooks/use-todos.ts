import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { post, patch, del } from "@/lib/client/api";
import type { Todo } from "@/types/api";

type TodosResponse = { todos: Todo[] };
type TodoResponse = { todo: Todo };

/** TODO の CRUD 操作を提供する SWR フック */
export function useTodos() {
  const { data, error, isLoading, mutate } = useSWR<TodosResponse>("/api/todos", fetcher);

  /** TODO を追加 */
  async function addTodo(title: string) {
    const res = await post<TodoResponse>("/api/todos", { title });
    await mutate((current) => {
      if (!current) return { todos: [res.todo] };
      return { todos: [res.todo, ...current.todos] };
    }, false);
  }

  /** TODO の完了状態を切り替え */
  async function updateTodo(id: number, updates: { title?: string; completed?: boolean }) {
    const res = await patch<TodoResponse>(`/api/todos/${id}`, updates);
    await mutate((current) => {
      if (!current) return current;
      return {
        todos: current.todos.map((t) => (t.id === id ? res.todo : t)),
      };
    }, false);
  }

  /** TODO を削除 */
  async function deleteTodo(id: number) {
    await del(`/api/todos/${id}`);
    await mutate((current) => {
      if (!current) return current;
      return { todos: current.todos.filter((t) => t.id !== id) };
    }, false);
  }

  return {
    todos: data?.todos ?? [],
    error,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}
