import { describe, it, expect } from "vitest";
import { todoSchema, todoUpdateSchema } from "../todo";

describe("todoSchema", () => {
  it("有効なタイトルでパースできる", () => {
    const result = todoSchema.safeParse({ title: "買い物に行く" });
    expect(result.success).toBe(true);
  });

  it("空文字列は拒否される", () => {
    const result = todoSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("200文字を超えるタイトルは拒否される", () => {
    const result = todoSchema.safeParse({ title: "あ".repeat(201) });
    expect(result.success).toBe(false);
  });

  it("200文字ちょうどのタイトルは許可される", () => {
    const result = todoSchema.safeParse({ title: "あ".repeat(200) });
    expect(result.success).toBe(true);
  });

  it("title が未指定だと拒否される", () => {
    const result = todoSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("todoUpdateSchema", () => {
  it("title のみでパースできる", () => {
    const result = todoUpdateSchema.safeParse({ title: "更新後のタイトル" });
    expect(result.success).toBe(true);
  });

  it("completed のみでパースできる", () => {
    const result = todoUpdateSchema.safeParse({ completed: true });
    expect(result.success).toBe(true);
  });

  it("title と completed の両方でパースできる", () => {
    const result = todoUpdateSchema.safeParse({ title: "新タイトル", completed: false });
    expect(result.success).toBe(true);
  });

  it("空オブジェクトでパースできる", () => {
    const result = todoUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("空文字列の title は拒否される", () => {
    const result = todoUpdateSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("completed に文字列を渡すと拒否される", () => {
    const result = todoUpdateSchema.safeParse({ completed: "yes" });
    expect(result.success).toBe(false);
  });
});
