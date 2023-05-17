export interface TodoResource {
  id: string;
  title: string | null;
  user_id: string;
  completed: boolean;
  created_at: Date | null;
}
