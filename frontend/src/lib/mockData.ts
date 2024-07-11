import { DeckType } from '@/types/DeckContext.type'
import { QuizzType } from '@/types/QuizzContext.type'
import { TagsType } from '@/types/TagsContext.type'
import { UserContextType } from '@/types/UserContext.type'


// mock tag data
export const mockTagsData: TagsType[] = [
  {
    name: "history"
  },
  {
    name: "french"
  },
  {
    name: "maths"
  },
  {
    name: "science"
  },
  {
    name: "english"
  },
  {
    name: "geography"
  },
  {
    name: "technology"
  },
  {
    name: "art"
  },
]

// mock user data
export const mockUsersData: UserContextType[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "user",
    isSubscribed: false,
    email_verified_at: null,
    created_at: "01/07/2024",
    updated_at:"01/07/2024"
  },
  {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "user",
    isSubscribed: false,
    email_verified_at: null,
    created_at: "01/07/2024",
    updated_at:"01/07/2024"
  },
  {
    name: "James Doe",
    email: "jane.doe@example.com",
    role: "user",
    isSubscribed: true,
    email_verified_at: "01/07/2024",
    created_at: "01/07/2024",
    updated_at:"01/07/2024"
  },
  {
    name: "Jerem Doe",
    email: "jerem.doe@example.com",
    role: "user",
    isSubscribed: true,
    email_verified_at: "01/07/2024",
    created_at: "01/07/2024",
    updated_at:"01/07/2024"
  },
  {
    name: "Jean Doe",
    email: "jean.doe@example.com",
    role: "user",
    isSubscribed: true,
    email_verified_at: "01/07/2024",
    created_at: "01/07/2024",
    updated_at:"01/07/2024"
  },
]

// mock quizz data
export const mockQuizzData: QuizzType[] = [
  {
    id: 1,
    name: "world war 2",
    visibility: "public",
    likes: 3,
    tags: mockTagsData[0],
    owner: mockUsersData[0],
    type: "quizz"
  },
  {
    id: 2,
    name: "grammar",
    visibility: "public",
    likes: 10,
    tags: mockTagsData[1],
    owner: mockUsersData[2],
    type: "quizz"
  },
  {
    id: 3,
    name: "Pythagore",
    visibility: "public",
    likes: 50,
    tags: mockTagsData[2],
    owner: mockUsersData[1],
    type: "quizz"
  },
  {
    id: 4,
    name: "english grammar",
    visibility: "public",
    likes: 21,
    tags: mockTagsData[4],
    owner: mockUsersData[0],
    type: "quizz"
  },
  {
    id: 5,
    name: "Capital city",
    visibility: "public",
    likes: 21,
    tags: mockTagsData[5],
    owner: mockUsersData[2],
    type: "quizz"
  },
  {
    id: 11,
    name: "Modern Technology",
    visibility: "public",
    likes: 12,
    tags: mockTagsData[6],
    owner: mockUsersData[3],
    type: "quizz"
  },
  {
    id: 12,
    name: "Renaissance Art",
    visibility: "public",
    likes: 8,
    tags: mockTagsData[7],
    owner: mockUsersData[4],
    type: "quizz"
  },
]

// mock quizz data
export const mockDeckData: DeckType[] = [
  {
    id: 6,
    name: "Napoleon",
    visibility: "public",
    likes: 7,
    tags: mockTagsData[0],
    owner: mockUsersData[0],
    type: "deck"
  },
  {
    id: 7,
    name: "COD",
    visibility: "public",
    likes: 15,
    tags: mockTagsData[1],
    owner: mockUsersData[2],
    type: "deck"
  },
  {
    id: 8,
    name: "Thales",
    visibility: "public",
    likes: 34,
    tags: mockTagsData[2],
    owner: mockUsersData[1],
    type: "deck"
  },
  {
    id: 9,
    name: "Conjugation",
    visibility: "public",
    likes: 34,
    tags: mockTagsData[4],
    owner: mockUsersData[0],
    type: "deck"
  },
  {
    id: 10,
    name: "demopraphy",
    visibility: "public",
    likes: 34,
    tags: mockTagsData[5],
    owner: mockUsersData[2],
    type: "deck"
  },
  {
    id: 13,
    name: "AI Innovations",
    visibility: "public",
    likes: 19,
    tags: mockTagsData[6],
    owner: mockUsersData[3],
    type: "deck"
  },
  {
    id: 14,
    name: "Impressionism",
    visibility: "public",
    likes: 22,
    tags: mockTagsData[7],
    owner: mockUsersData[4],
    type: "deck"
  },
]
