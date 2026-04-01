/**
 * インメモリ Rate Limiter
 *
 * 本番環境では Redis ベースの実装に差し替えることを推奨する。
 * Vercel 等のサーバーレス環境ではインスタンス間で状態を共有できない点に注意。
 *
 * @example
 * const limiter = createRateLimit({ interval: 60_000, limit: 10 });
 *
 * // middleware.ts や handler 内で使用
 * const { success } = limiter.check(ip);
 * if (!success) {
 *   return NextResponse.json({ error: "リクエスト数が上限に達しました" }, { status: 429 });
 * }
 */

type RateLimitOptions = {
  /** ウィンドウサイズ（ミリ秒） */
  interval: number;
  /** ウィンドウ内の最大リクエスト数 */
  limit: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export function createRateLimit({ interval, limit }: RateLimitOptions) {
  const tokens = new Map<string, { count: number; reset: number }>();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = tokens.get(key);

      // ウィンドウ期限切れ or 新規 → リセット
      if (!entry || now > entry.reset) {
        const reset = now + interval;
        tokens.set(key, { count: 1, reset });
        return { success: true, remaining: limit - 1, reset };
      }

      // ウィンドウ内
      if (entry.count < limit) {
        entry.count++;
        return { success: true, remaining: limit - entry.count, reset: entry.reset };
      }

      return { success: false, remaining: 0, reset: entry.reset };
    },
  };
}
