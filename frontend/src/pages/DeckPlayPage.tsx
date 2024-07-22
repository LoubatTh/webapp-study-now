import { ResourceForbidden } from "@/components/errors/ResourceForbidden";
import ResourceNotFound from "@/components/errors/ResourceNotFound";
import DeckComponent from "@/components/deck/DeckComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import useFlashcardStore from "@/lib/stores/flashcardStore";
import useStore from "@/lib/stores/resultStore";
import { Deck } from "@/types/deck.type";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const getDeck = async (deckId: string, accessToken?: string) => {
  const response = await fetchApi("GET", `decks/${deckId}`, null, accessToken);
  return response;
};

const postResult = async (body: any, accessToken: string) => {
  const response = await fetchApi("POST", `decks/results`, body, accessToken);
  return response;
};

const DeckPlayPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { setScore } = useStore();
  const { addRating, getAverageRating, allFlashcardsGraded } =
    useFlashcardStore();
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const handleResult = () => {
    if (!deck || !allFlashcardsGraded(deck.flashcards.length)) {
      toast({
        description: "You didnt graded all flashcards",
        variant: "destructive",
      });
      return;
    }
    const rating = getAverageRating();
    if (accessToken) {
      postResultToApi();
    } else {
      console.log(rating);
      setScore(rating ? rating : 0);
      navigate(`/deck/${deckId}/result`);
    }
  };

  const postResultToApi = async () => {
    if (!deckId) {
      console.error("Deck ID is required");
      navigate("/");
      return;
    }
    if (!accessToken) {
      console.error("Access token is required");
      return;
    }

    const body = {
      deck_id: deckId,
      grade: getAverageRating(),
    };

    const response = await postResult(body, accessToken);
    if (response.status === 201) {
      navigate(`/deck/${deckId}/result`);
    } else if (response.status === 403) {
      console.error("Failed to post result:", response);
    }
  };

  const fetchDeck = async () => {
    if (!deckId) {
      console.error("Deck ID is required");
      navigate("/");
      return;
    }
    let response: any;
    if (accessToken) {
      response = await getDeck(deckId, accessToken);
    } else {
      response = await getDeck(deckId);
    }
    console.log(response);

    if (response.status == 403 || response.status == 401) {
      setIsForbidden(true);
    }
    if (response.status == 404 || response.status == 500) {
      setIsNotFound(true);
    }
    if (response.status === 200) {
      const data: Deck = response.data as Deck;
      setDeck(data);
      for (let i = 0; i < data.flashcards.length; i++) {
        addRating(i, 0);
      }
      console.log(data);
    } else {
      console.error("Failed to fetch deck:", response);
    }
  };

  useEffect(() => {
    setIsForbidden(false);
    setIsNotFound(false);
    fetchDeck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, accessToken]);

  if (isForbidden) {
    return <ResourceForbidden type="deck" />;
  }
  if (isNotFound) {
    return <ResourceNotFound type="deck" />;
  }

  return (
    <div className="flex flex-col justify-center items-center text-center gap-8 max-w-3xl min-w-full md:min-w-[768px] mx-auto p-6">
      {deck && (
        <>
          <DeckComponent
            id={deck.id}
            name={deck.name}
            isPublic={deck.is_public}
            flashcards={deck.flashcards}
          />
          <Button
            onClick={() => handleResult()}
            className="w-full md:w-1/3 mb-8"
          >
            Get my result
          </Button>
        </>
      )}
    </div>
  );
};

export default DeckPlayPage;
