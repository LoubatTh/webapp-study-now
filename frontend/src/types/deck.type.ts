export type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export type Deck = {
  id: number;
  name: string;
  type: string;
  tag: string;
  is_public: boolean;
  is_organization?: boolean;
  likes: number;
  flashcards: Flashcard[];
};

export type PostDeck = {
  name: string;
  is_public: boolean;
  flashcards: Flashcard[];
};
