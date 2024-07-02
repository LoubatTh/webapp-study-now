import { Flashcard } from "@/types/deck.type";

type DeckComponentProps = {
  id: number;
  name: string;
  isPublic: boolean;
  flashcards: Flashcard[];
};

const DeckComponent = ({
  id,
  name,
  isPublic,
  flashcards,
}: DeckComponentProps) => {
  return (
    <div>
      <h1>
        {name}
        {id}
      </h1>
      <p>{isPublic ? "Public" : "Private"}</p>
      <p>{flashcards?.length} flashcards</p>
    </div>
  );
};

export default DeckComponent;
