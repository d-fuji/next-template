// API 型定義
// docs/openapi.yaml のスキーマに対応する型をここに定義する

export type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};
