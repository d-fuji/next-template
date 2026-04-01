import { ApiError } from "@/lib/client/api";
import { toast } from "sonner";

/**
 * フォーム送信の共通処理。
 * try/catch + toast.success/toast.error + form.setError("root") のパターンを集約する。
 */
export async function submitForm(
  action: () => Promise<unknown>,
  successMessage: string,
  form: { setError: (name: "root", error: { message: string }) => void },
  onSuccess: () => void
): Promise<void> {
  try {
    await action();
    toast.success(successMessage);
    onSuccess();
  } catch (e) {
    const message = e instanceof ApiError ? e.message : "エラーが発生しました";
    form.setError("root", { message });
    toast.error(message);
  }
}
