import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { AppError } from "@/lib/api-utils";

/**
 * API ハンドラービルダー
 *
 * 認証チェック・クエリ/ボディバリデーション・エラーハンドリングを
 * 宣言的に合成し、ハンドラーからボイラープレートを排除する。
 *
 * @example
 * // 認証不要 + クエリバリデーション
 * export const GET = createHandler()
 *   .withQuery(querySchema)
 *   .handle(async ({ query }) => {
 *     return { items: await findItems(query) };
 *   });
 *
 * @example
 * // 認証必須 + ボディバリデーション + 201 レスポンス
 * export const POST = createHandler()
 *   .withAuth()
 *   .withBody(createSchema)
 *   .withStatus(201)
 *   .handle(async ({ userId, body }) => {
 *     return await createItem(userId, body);
 *   });
 */

// ===== 型定義 =====

type RouteParams = Record<string, string>;

type HandlerContext<TQuery = undefined, TBody = undefined, TAuth extends boolean = false> = {
  request: NextRequest;
  params: RouteParams;
} & (TAuth extends true ? { userId: string } : { userId?: undefined }) &
  (TQuery extends undefined ? { query?: undefined } : { query: TQuery }) &
  (TBody extends undefined ? { body?: undefined } : { body: TBody });

type HandlerFn<TQuery, TBody, TAuth extends boolean> = (
  ctx: HandlerContext<TQuery, TBody, TAuth>
) => Promise<unknown>;

// ===== ビルダー =====

class ApiHandlerBuilder<TQuery = undefined, TBody = undefined, TAuth extends boolean = false> {
  private authRequired = false as TAuth;
  private querySchema?: z.ZodSchema;
  private bodySchema?: z.ZodSchema;
  private statusCode = 200;

  withAuth(): ApiHandlerBuilder<TQuery, TBody, true> {
    const next = this as unknown as ApiHandlerBuilder<TQuery, TBody, true>;
    next.authRequired = true as never;
    return next;
  }

  withQuery<T>(schema: z.ZodSchema<T>): ApiHandlerBuilder<T, TBody, TAuth> {
    const next = this as unknown as ApiHandlerBuilder<T, TBody, TAuth>;
    next.querySchema = schema;
    return next;
  }

  withBody<T>(schema: z.ZodSchema<T>): ApiHandlerBuilder<TQuery, T, TAuth> {
    const next = this as unknown as ApiHandlerBuilder<TQuery, T, TAuth>;
    next.bodySchema = schema;
    return next;
  }

  withStatus(code: number): this {
    this.statusCode = code;
    return this;
  }

  handle(
    fn: HandlerFn<TQuery, TBody, TAuth>
  ): (request: NextRequest, context: { params: Promise<RouteParams> }) => Promise<NextResponse> {
    const { authRequired, querySchema, bodySchema, statusCode } = this;

    return async (request, context) => {
      try {
        const params = await context.params;

        // 認証チェック
        let userId: string | undefined;
        if (authRequired) {
          const session = await auth();
          if (!session?.user?.id) {
            throw new AppError("未認証", 401);
          }
          userId = session.user.id;
        }

        // クエリバリデーション
        let query: TQuery | undefined;
        if (querySchema) {
          const raw = Object.fromEntries(request.nextUrl.searchParams);
          const result = querySchema.safeParse(raw);
          if (!result.success) {
            throw new AppError(result.error.issues.map((i) => i.message).join(", "), 400);
          }
          query = result.data as TQuery;
        }

        // ボディバリデーション
        let body: TBody | undefined;
        if (bodySchema) {
          const raw = await request.json();
          const result = bodySchema.safeParse(raw);
          if (!result.success) {
            throw new AppError(result.error.issues.map((i) => i.message).join(", "), 400);
          }
          body = result.data as TBody;
        }

        // ハンドラー実行
        const ctx = {
          request,
          params,
          userId,
          query,
          body,
        } as unknown as HandlerContext<TQuery, TBody, TAuth>;
        const result = await fn(ctx);

        return NextResponse.json(result, { status: statusCode });
      } catch (error) {
        if (error instanceof AppError) {
          return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
      }
    };
  }
}

export function createHandler(): ApiHandlerBuilder {
  return new ApiHandlerBuilder();
}
