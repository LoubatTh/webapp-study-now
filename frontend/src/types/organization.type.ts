export type Organization = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  owner_id: number;
  owner: string;
  tags: string[];
  removeOrganization?: (id: number) => void;
  updateOrganization?: (id: number, name: string, description: string) => void;
};