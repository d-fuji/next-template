"use client";

import { useState } from "react";
import { TodoItem } from "@/components/molecules/todo-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Todo } from "@/types/api";

type Filter = "all" | "active" | "completed";

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
};

const FILTER_LABELS: Record<Filter, string> = {
  all: "全て",
  active: "未完了",
  completed: "完了",
};

export function TodoList({ todos, onToggle, onDelete, isLoading }: TodoListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const filtered = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* フィルタータブ */}
      <div className="flex gap-1">
        {(Object.entries(FILTER_LABELS) as [Filter, string][]).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* TODO リスト */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {filter === "all"
            ? "TODO はまだありません"
            : `${FILTER_LABELS[filter]}の TODO はありません`}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
