import type { PrismaClient } from "@/generated/prisma/client";
import type { TodoUpdateInput } from "@/lib/validations/todo";

/**
 * TODO サービス
 *
 * TODO の CRUD 操作をカプセル化する。
 * PrismaClient をコンストラクタで受け取り、テスト時の差し替えを容易にする。
 */
export class TodoService {
  constructor(private readonly prisma: PrismaClient) {}

  /** ユーザーの全 TODO を取得（新しい順） */
  async getByUserId(userId: string) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, completed: true, createdAt: true },
    });
  }

  /** TODO を作成 */
  async create(userId: string, title: string) {
    return this.prisma.todo.create({
      data: { userId, title },
      select: { id: true, title: true, completed: true, createdAt: true },
    });
  }

  /** TODO を更新 */
  async update(id: number, userId: string, data: TodoUpdateInput) {
    await this.ensureOwnership(id, userId);
    return this.prisma.todo.update({
      where: { id },
      data,
      select: { id: true, title: true, completed: true, createdAt: true },
    });
  }

  /** TODO を削除 */
  async delete(id: number, userId: string) {
    await this.ensureOwnership(id, userId);
    await this.prisma.todo.delete({ where: { id } });
  }

  /** 所有権を検証 */
  private async ensureOwnership(id: number, userId: string) {
    const { AppError } = await import("@/lib/api/errors");
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!todo || todo.userId !== userId) {
      throw new AppError("TODO が見つかりません", 404);
    }
  }
}
