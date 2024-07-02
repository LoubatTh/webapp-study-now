import DeckComponent from "@/components/deck/DeckComponent";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const getDeck = async (deckId: string | undefined) => {
  const response = await fetchApi("GET", `decks/${deckId}`);
  return response;
};

const DeckPlayPage = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});

  const fetchDeck = async () => {
    const response = await getDeck(deckId);
    if (response.status === 200) {
      const data = response.data;
      setDeck(data);
      console.log(data);
    }
  };

  useEffect(() => {
    fetchDeck();
  });

  return (
    <div>
      <DeckComponent flashcards={} />
    </div>
  );
};

export default DeckPlayPage;
