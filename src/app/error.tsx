"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-dvh px-4">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold">エラーが発生しました</h2>
          <p className="text-sm text-muted-foreground mt-2">予期しないエラーが発生しました。</p>
          <div className="flex justify-center gap-3 mt-4">
            <Button variant="outline" onClick={reset}>
              再試行
            </Button>
            <Link href="/" className={cn(buttonVariants())}>
              ホームへ戻る
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
