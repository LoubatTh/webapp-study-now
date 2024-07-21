export type UserContextType = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_subscribed: boolean;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  setUser: (user: UserContextType) => void;
  clearUser: () => void;
  refreshUser: () => void;
};
