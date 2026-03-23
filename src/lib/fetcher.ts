export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
      throw new Error("未認証");
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "データの取得に失敗しました");
  }
  return res.json();
}
