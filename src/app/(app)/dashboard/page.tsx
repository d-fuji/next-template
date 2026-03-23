"use client";

import { useTodos } from "@/lib/hooks/use-todos";
import { DashboardTemplate } from "@/components/templates/dashboard-template";

export default function DashboardPage() {
  const { todos, error, isLoading, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <DashboardTemplate
      todos={todos}
      isLoading={isLoading}
      error={error}
      onAdd={addTodo}
      onToggle={(id, completed) => updateTodo(id, { completed })}
      onDelete={deleteTodo}
    />
  );
}
