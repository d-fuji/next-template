import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { z } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export async function getSessionUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AppError("未認証", 401);
  }
  return session.user.id;
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  console.error("Unexpected error:", error);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

export async function parseBody<T>(request: Request, schema: z.ZodSchema<T>): Promise<T> {
  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new AppError(result.error.issues.map((issue) => issue.message).join(", "), 400);
  }
  return result.data;
}
