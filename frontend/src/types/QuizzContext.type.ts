import { TagsType } from "./TagsContext.type"
import { UserContextType } from "./UserContext.type"

export type QuizzType = {
  id: number,
  name: string,
  visibility: string,
  likes: number,
  tags: TagsType,
  owner: UserContextType,
  type: "quizz"
}
