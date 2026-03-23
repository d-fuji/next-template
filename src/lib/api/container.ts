// import { prisma } from "@/lib/prisma";
// import { ExampleService } from "@/lib/services/example-service";

/**
 * DI コンテナ
 *
 * サービスの生成と依存関係の注入を一元管理する。
 * テスト時はこのコンテナごとモックに差し替え可能。
 *
 * @example
 * // サービスを追加する場合:
 * // 1. src/lib/services/ にサービスクラスを作成
 * // 2. ここに getter を追加
 * //
 * // import { prisma } from "@/lib/prisma";
 * // import { UsersService } from "@/lib/services/users-service";
 * //
 * // export const container = {
 * //   get users() {
 * //     return new UsersService(prisma);
 * //   },
 * // };
 *
 * @example
 * // ルートハンドラーからの使用:
 * // import { container } from "@/lib/api/container";
 * // const items = await container.items.getByUserId(userId);
 *
 * @example
 * // テスト時のモック:
 * // const mockContainer = {
 * //   items: { getByUserId: vi.fn().mockResolvedValue([]) },
 * // };
 */
export const container = {
  // サービスをここに追加:
  // get example() {
  //   return new ExampleService(prisma);
  // },
};

export type Container = typeof container;
