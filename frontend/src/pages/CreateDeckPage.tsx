import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PostDeck } from "@/types/deck.type";
import { fetchApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import useDeckStore from "../lib/stores/deckStore";
import CreateFlashcard from "@/components/deck/CreateFlashcard";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const postDeck = async (deck: PostDeck, accessToken: string) => {
  const response = await fetchApi("POST", "decks", deck, accessToken);
  return response;
};

const editDeck = async (id: string, deck: PostDeck, accessToken: string) => {
  const response = await fetchApi("PUT", `decks/${id}`, deck, accessToken);
  return response;
};

const getLabels = async () => {
  const response = await fetchApi("GET", "tags");
  return response;
};

const getDeck = async (id: string, accessToken: string) => {
  const response = await fetchApi("GET", `decks/${id}`, null, accessToken);
  return response;
};

const CreateDeckPage = () => {
  //Get the navigate function from the useNavigate hook
  const navigate = useNavigate();
  //Get the access token from the AuthContext
  const { accessToken } = useAuth();
  //Get the user from the AuthUser
  const { name } = useUser();
  //Check if its a creation page or an edition page
  const { id } = useParams();
  //Use the useDeckStore store to get the decks
  const { deck, saveFlashcard, removeFlashcard, resetDeck } = useDeckStore();
  //loading state
  const [loading, setLoading] = useState<boolean>(true);
  //State to manage the name of the deck
  const [nameDeck, setNameDeck] = useState<string>("");
  //State to manage the lable of the deck
  const [label, setLabel] = useState<string>("");
  //State to manage the visibility of the deck
  const [isPublic, setIsPublic] = useState<boolean>(false);
  //State to store the labels
  const [labels, setLabels] = useState<string[]>([]);
  //State to manage the error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  //State to manage the list of decks
  const [deckList, setFlashcardList] = useState([{ id: 0, collapsed: false }]);

  //Function to add a new flashcard to the list
  const addNewFlashcard = (): void => {
    setFlashcardList([...deckList, { id: deckList.length, collapsed: false }]);
  };

  //Function to delete a flashcard from the list
  const deleteFlashcard = (id: number): void => {
    setFlashcardList(deckList.filter((flashcard) => flashcard.id !== id));
    removeFlashcard(id);
  };

  //Function to toggle the collapse of a deck
  const toggleCollapse = (id: number): void => {
    setFlashcardList(
      deckList.map((flashcard) =>
        flashcard.id === id
          ? { ...flashcard, collapsed: !flashcard.collapsed }
          : flashcard
      )
    );
  };

  //Function to create the flashcard with the decks and send it to the backend
  const createDeckHandler = async (): Promise<void> => {
    if (nameDeck.length < 1) {
      setErrorMessage("The name field is required.");
      return;
    } else if (deck.length < 1) {
      setErrorMessage("You need to add at least one Flashcard.");
      return;
    } else if (label === "") {
      setErrorMessage("You need to select a label.");
      return;
    } else {
      setErrorMessage("");
      const createdDeck = {
        name: nameDeck,
        is_public: isPublic,
        tag_id: parseInt(label),
        flashcards: deck,
      };
      try {
        let response: any;
        if (id) {
          response = await editDeck(id, createdDeck, accessToken);
          if (response.status === 204) {
            toast({ description: "Deck edited successfully" });
          } else {
            throw new Error(response.data.message);
          }
        } else {
          response = await postDeck(createdDeck, accessToken);
          if (response.status === 201) {
            toast({ description: "Deck created successfully" });
          } else {
            throw new Error(response.data.message);
          }
        }
        setNameDeck("");
        setFlashcardList([{ id: 0, collapsed: false }]);
        resetDeck();
        navigate("/board");
      } catch (error: any) {
        toast({ description: error.message });
      }
    }
  };

  const fetchLabelsAndDeckData = async (id: string, accessToken: string) => {
    try {
      const labelsResponse = await getLabels();
      if (labelsResponse.status === 200) {
        setLabels(labelsResponse.data);

        if (id) {
          const deckResponse = await getDeck(id, accessToken);
          if (deckResponse.status === 200) {
            const data = deckResponse.data as PostDeck;
            if (data.owner !== name) {
              navigate("/");
              return;
            }
            setNameDeck(data.name);
            const foundLabel = labelsResponse.data.find(
              (label) => label.name === data.tag
            );
            setLabel(foundLabel ? foundLabel.id : "");

            setIsPublic(data.is_public);

            const copiedFlashcards = data.flashcards.map((flashcard) => ({
              ...flashcard,
              question: flashcard.question,
              answer: flashcard.answer,
              collapsed: true,
            }));

            copiedFlashcards.forEach((flashcard) => {
              saveFlashcard(flashcard);
            });
            setFlashcardList(copiedFlashcards);
          } else {
            toast({ description: deckResponse.data.message });
          }
        }
      } else {
        toast({ description: labelsResponse.data.message });
      }
    } catch (error) {
      toast({ description: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (accessToken && name) {
      fetchLabelsAndDeckData(id, accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, name, loading]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">Create Deck</h1>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Deck name</Label>
        <Input
          id="name"
          type="text"
          placeholder="My Deck name"
          value={nameDeck}
          onChange={(e) => setNameDeck(e.target.value)}
        />
        {errorMessage && (
          <div className="text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="max-w-3xl min-w-full md:min-w-[768px] p-2">
        <Select value={label} onValueChange={(e) => setLabel(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a label" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {labels.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Visibility</Label>
        <div className="flex gap-2">
          <Switch
            checked={isPublic}
            onCheckedChange={() => setIsPublic(!isPublic)}
          />
          <div>{isPublic ? "Public" : "Private"}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        {deckList.map((flashcard, i) => (
          <React.Fragment key={flashcard.id}>
            <Separator className="my-2" />
            <div className="text-center">
              Flashcard {i + 1} of {deckList.length}
            </div>
            <CreateFlashcard
              id={flashcard.id}
              flashcard={flashcard}
              index={i + 1}
              flashcardsSize={deckList.length}
              collapsed={flashcard.collapsed}
              onToggleCollapse={() => toggleCollapse(flashcard.id)}
              onDelete={() => deleteFlashcard(flashcard.id)}
            />
          </React.Fragment>
        ))}
        <Button onClick={addNewFlashcard} variant="default" className="mt-2">
          Add New Flashcard
        </Button>
        <Separator className="my-2" />
        <Button onClick={createDeckHandler} variant="default">
          Create Deck
        </Button>
      </div>
    </div>
  );
};

export default CreateDeckPage;
