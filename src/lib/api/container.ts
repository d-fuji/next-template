import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/services/auth-service";
import { TodoService } from "@/lib/services/todo-service";

/**
 * DI コンテナ
 *
 * サービスの生成と依存関係の注入を一元管理する。
 * テスト時はこのコンテナごとモックに差し替え可能。
 */
export const container = {
  get auth() {
    return new AuthService(prisma);
  },
  get todos() {
    return new TodoService(prisma);
  },
};

export type Container = typeof container;
