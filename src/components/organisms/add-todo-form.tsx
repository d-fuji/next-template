"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

type AddTodoFormProps = {
  onAdd: (title: string) => Promise<void>;
};

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しい TODO を入力..."
        disabled={isSubmitting}
        maxLength={200}
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting || !title.trim()}>
        <Plus className="mr-1 h-4 w-4" />
        追加
      </Button>
    </form>
  );
}
