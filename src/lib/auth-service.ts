import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/api-utils";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

export async function registerUser(email: string, password: string, name: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError("パスワードは8文字以上で入力してください", 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("このメールアドレスは既に登録されています", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, image: true, password: true },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, email: user.email, name: user.name, image: user.image };
}
