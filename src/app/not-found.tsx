import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <h2 className="text-lg font-semibold mt-4">ページが見つかりません</h2>
          <p className="text-sm text-muted-foreground mt-2">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            ダッシュボードへ戻る
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
