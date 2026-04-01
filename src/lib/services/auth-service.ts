import type { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * 認証サービス
 *
 * ユーザー登録・認証ロジックをカプセル化する。
 * PrismaClient をコンストラクタで受け取り、テスト時の差し替えを容易にする。
 */
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  /** ユーザー登録 */
  async register(email: string, password: string, name: string) {
    const { AppError } = await import("@/lib/api/errors");

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("このメールアドレスは既に登録されています", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }

  /** メール+パスワードによるユーザー認証 */
  async authenticate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, image: true, password: true },
    });

    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { id: user.id, email: user.email, name: user.name, image: user.image };
  }
}
