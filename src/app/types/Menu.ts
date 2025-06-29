export interface Menu {
  id: number;
  name: string;
  slug: string;
  url: string | null;
  icon: string;
  parent_id: number | null;
  sort_order: number;
  status: number;
  created_at: string;
  updated_at: string;
  children?: Menu[];
}