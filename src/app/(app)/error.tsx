"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: Props) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold">エラーが発生しました</h2>
          <p className="text-sm text-muted-foreground mt-2">
            予期しないエラーが発生しました。再試行してください。
          </p>
          <Button className="mt-4" onClick={reset}>
            再試行
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
