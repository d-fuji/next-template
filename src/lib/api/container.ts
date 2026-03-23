import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/services/auth-service";

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
 * // import { PointService } from "@/lib/services/point-service";
 * //
 * // export const container = {
 * //   ...既存のサービス,
 * //   get points() {
 * //     return new PointService(prisma);
 * //   },
 * // };
 *
 * @example
 * // ルートハンドラーからの使用:
 * // import { container } from "@/lib/api/container";
 * // const user = await container.auth.register(email, password, name);
 *
 * @example
 * // テスト時のモック:
 * // const mockContainer = {
 * //   auth: { register: vi.fn(), authenticate: vi.fn() },
 * // };
 */
export const container = {
  get auth() {
    return new AuthService(prisma);
  },
};

export type Container = typeof container;
