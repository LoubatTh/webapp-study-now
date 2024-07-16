import DeckComponent from "@/components/deck/DeckComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import useFlashcardStore from "@/lib/stores/flashcardStore";
import { Deck } from "@/types/deck.type";
import { fetchApi } from "@/utils/api";
import { Rating, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const getDeck = async (deckId: string, accessToken?: string) => {
  const response = await fetchApi("GET", `decks/${deckId}`, null, accessToken);
  return response;
};

const DeckPlayPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { addRating, getAverageRating } = useFlashcardStore();
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const handleResult = () => {
    const rating = getAverageRating();
    setResult(rating);
  };

  const fetchDeck = async () => {
    if (!deckId) {
      console.error("Deck ID is required");
      navigate("/");
      return;
    }
    let response;
    if (accessToken) {
      response = await getDeck(deckId, accessToken);
    } else {
      response = await getDeck(deckId);
    }
    if (response.status === 200) {
      const data: Deck = response.data as Deck;
      console.log(data);
      setDeck(data);
      for (let i = 0; i < data.flashcards.length; i++) {
        addRating(i, 0);
      }
    } else {
      console.error("Failed to fetch deck:", response);
    }
  };

  useEffect(() => {
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, accessToken]);

  if (!deck) {
    return (
      <div className="flex justify-center text-center text-6xl h-screen my-auto">
        <div>No deck found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center text-center gap-8 max-w-3xl min-w-full md:min-w-[768px] mx-auto">
      <DeckComponent
        id={deck.id}
        name={deck.name}
        isPublic={deck.isPublic}
        flashcards={deck.flashcards}
      />
      <Button onClick={() => handleResult()} className="w-1/3">
        Get my result
      </Button>
      {result > 0 && result !== null && (
        <div className="flex flex-col">
          <Typography>My final score</Typography>
          {result !== 0 && <Rating value={result} size="large" readOnly />}
        </div>
      )}
    </div>
  );
};

export default DeckPlayPage;
