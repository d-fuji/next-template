"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "@/lib/types/api";
import { Trash2 } from "lucide-react";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) => onToggle(todo.id, checked === true)}
        aria-label={`「${todo.title}」を完了にする`}
      />
      <span
        className={`flex-1 text-sm ${todo.completed ? "text-muted-foreground line-through" : ""}`}
      >
        {todo.title}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(todo.id)}
        aria-label={`「${todo.title}」を削除`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
