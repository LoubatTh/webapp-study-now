import DeckComponent from "@/components/deck/DeckComponent";
import { Deck } from "@/types/deck.type";
import { fetchApi } from "@/utils/api";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const getDeck = async (deckId: string | undefined) => {
  const response = await fetchApi("GET", `decks/${deckId}`);
  return response;
};

const DeckPlayPage = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState<Deck | undefined>(undefined);

  const fetchDeck = async () => {
    const response = await getDeck(deckId);
    if (response.status === 200) {
      if (response.data !== null) {
        const data: Deck = response.data;
        console;
        setDeck(data);
      }
    }
  };

  useEffect(() => {
    fetchDeck();
    console.log(deck);
  }, []);

  return <div>{/* <DeckComponent /> */}</div>;
};

export default DeckPlayPage;
