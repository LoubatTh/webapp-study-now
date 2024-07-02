import DeckComponent from "@/components/deck/DeckComponent";
import { Deck } from "@/types/deck.type";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const getDeck = async (deckId: string) => {
  const response = await fetchApi("GET", `decks/${deckId}`);
  return response;
};

const DeckPlayPage = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);

  const fetchDeck = async () => {
    if (!deckId) {
      console.error("Deck ID is required");
      navigate("/");
      return;
    }

    const response = await getDeck(deckId);
    if (response.status === 200) {
      const data: Deck = response.data as Deck;
      console.log(data);
      setDeck(data);
    } else {
      console.error("Failed to fetch deck:", response);
    }
  };

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId]);

  if (!deck) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DeckComponent
        id={deck.id}
        name={deck.name}
        isPublic={deck.isPublic}
        flashcards={deck.flashcards}
      />
    </div>
  );
};

export default DeckPlayPage;
