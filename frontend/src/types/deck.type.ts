export type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export type Deck = {
  id: number;
  name: string;
  isPublic: boolean;
  flashcards: Flashcard[];
};

export type PostDeck = {
  name: string;
  isPublic: boolean;
  flashcards: Flashcard[];
};
