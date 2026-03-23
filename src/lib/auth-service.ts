import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/services/auth-service";

/**
 * Auth.js 用ファサード
 *
 * Auth.js の Credentials プロバイダーはルートハンドラー外で動作するため、
 * DI コンテナを経由せず直接 AuthService をインスタンス化する。
 */
const authService = new AuthService(prisma);

/** ユーザー登録（後方互換のため維持） */
export const registerUser = authService.register.bind(authService);

/** メール+パスワードによるユーザー認証 */
export const authenticateUser = authService.authenticate.bind(authService);
