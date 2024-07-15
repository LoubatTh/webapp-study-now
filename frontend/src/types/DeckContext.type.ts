import { TagsType } from "./tag.type";
import { UserContextType } from "./UserContext.type";

export type DeckType = {
  id: number;
  name: string;
  visibility: string;
  likes: number;
  tags: TagsType;
  owner: UserContextType;
  type: "deck";
};
