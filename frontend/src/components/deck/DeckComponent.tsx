import { Flashcard } from "@/types/deck.type";
import React from "react";
import FlashcardComponent from "./FlashcardComponent";
import { Separator } from "../ui/separator";

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
      <h1 className="text-3xl my-8 font-bold uppercase">{name}</h1>
      <div className="flex flex-col gap-8">
        {flashcards.map((flashcard, i) => (
          <React.Fragment key={i}>
            <Separator />
            <FlashcardComponent
              question={flashcard.question}
              answer={flashcard.answer}
              index={i}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DeckComponent;
