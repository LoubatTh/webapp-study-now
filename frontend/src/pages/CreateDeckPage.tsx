import React, { useState } from "react";
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
import { redirect } from "react-router-dom";

const postDeck = async (deck: PostDeck, accessToken: string) => {
  const response = await fetchApi("POST", "decks", deck, accessToken);
  console.log(response);
  return response;
};

const CreateDeckPage = () => {
  //Get the access token from the AuthContext
  const { accessToken } = useAuth();
  //Use the useDeckStore store to get the decks
  const { deck, resetDeck } = useDeckStore();
  //State to manage the name of the deck
  const [name, setName] = useState<string>("");
  //State to manage the visibility of the deck
  const [isPublic, setIsPublic] = useState<boolean>(false);
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
  async function createQuizzHandler(): Promise<void> {
    if (name.length < 1) {
      setErrorMessage("The name field is required.");
      return;
    } else if (deck.length < 1) {
      setErrorMessage("You need to add at least one Flashcard.");
      return;
    } else {
      setErrorMessage("");
      const createdDeck = {
        name,
        isPublic,
        flashcards: deck,
      };
      console.log(createdDeck);
      const response = await postDeck(createdDeck, accessToken);
      if (response.status === 201) {
        setName("");
        setFlashcardList([{ id: 0, collapsed: false }]);
        resetDeck;
        toast({
          description: "Deck created successfully",
        });
        redirect("/homepage");
      } else {
        const data = await response.data.json();
        toast({ description: data.message });
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">Create Deck</h1>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Deck name</Label>
        <Input
          id="name"
          type="text"
          placeholder="My Deck name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errorMessage && (
          <div className="text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}
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
        <Button onClick={createQuizzHandler} variant="default">
          Create Deck
        </Button>
      </div>
    </div>
  );
};

export default CreateDeckPage;
