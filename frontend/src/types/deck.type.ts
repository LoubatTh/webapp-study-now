export type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

export type Deck = {
  id: number;
  name: string;
  flashcards: Flashcard[];
};
