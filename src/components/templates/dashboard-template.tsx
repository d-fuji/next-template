import { AddTodoForm } from "@/components/organisms/add-todo-form";
import { TodoList } from "@/components/organisms/todo-list";
import type { Todo } from "@/types/api";

type DashboardTemplateProps = {
  todos: Todo[];
  isLoading: boolean;
  error: Error | undefined;
  onAdd: (title: string) => Promise<void>;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
};

export function DashboardTemplate({
  todos,
  isLoading,
  error,
  onAdd,
  onToggle,
  onDelete,
}: DashboardTemplateProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">TODO</h1>

      <AddTodoForm onAdd={onAdd} />

      {error ? (
        <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          データの取得に失敗しました
        </p>
      ) : (
        <TodoList todos={todos} onToggle={onToggle} onDelete={onDelete} isLoading={isLoading} />
      )}
    </div>
  );
}
