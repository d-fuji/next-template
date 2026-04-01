/**
 * API エラークラス
 *
 * サービス層・ハンドラー層の両方で使用する。
 * createHandler() が catch して適切な HTTP レスポンスに変換する。
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AppError";
  }
}
