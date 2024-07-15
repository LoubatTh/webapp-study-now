export type Organization = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  owner_id: number;
  tags: string[];
};