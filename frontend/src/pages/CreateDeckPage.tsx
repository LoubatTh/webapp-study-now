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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { Organization } from "@/types/organization.type";
import { Tag } from "@/types/tag.type";
import { Info, Square, SquareCheck } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const postDeck = async (deck: PostDeck, accessToken: string) => {
  const response = await fetchApi("POST", "decks", deck, accessToken);
  return response;
};

const editDeck = async (id: string, deck: PostDeck, accessToken: string) => {
  console.log("Deck: ", deck);
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
  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();
  // Get the access token from the AuthContext
  const { accessToken } = useAuth();
  // Get the user from the AuthUser
  const { name } = useUser();
  // Check if its a creation page or an edition page
  const { id } = useParams();
  // Get the search params
  const [searchParams] = useSearchParams();
  // Get the name of the organization from the search params
  const organizationName = searchParams.get("organization");
  // Use the useDeckStore store to get the decks
  const { deck, saveFlashcard, removeFlashcard, resetDeck } = useDeckStore();
  // Loading state
  const [loading, setLoading] = useState<boolean>(true);
  // State to manage the name of the deck
  const [nameDeck, setNameDeck] = useState<string>("");
  // State to manage the label of the deck
  const [label, setLabel] = useState<string>("");
  // State to manage the visibility of the deck
  const [isPublic, setIsPublic] = useState<boolean>(false);
  // State to store the labels
  const [labels, setLabels] = useState<Tag[]>([]);
  // State to manage the error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  // State to manage the list of flashcards
  const [flashcardList, setFlashcardList] = useState([
    { id: 0, collapsed: false },
  ]);
  // State to manage selected organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  // State to manage the selected organizations
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);
  // State to manage the filtered organizations for the autocomplete
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);

  // Function to add a new flashcard to the list
  const addNewFlashcard = (): void => {
    setFlashcardList([
      ...flashcardList,
      { id: flashcardList.length, collapsed: false },
    ]);
  };

  // Function to delete a flashcard from the list
  const deleteFlashcard = (id: number): void => {
    setFlashcardList(flashcardList.filter((flashcard) => flashcard.id !== id));
    removeFlashcard(id);
  };

  // Function to toggle the collapse of a flashcard
  const toggleCollapse = (id: number): void => {
    setFlashcardList(
      flashcardList.map((flashcard) =>
        flashcard.id === id
          ? { ...flashcard, collapsed: !flashcard.collapsed }
          : flashcard
      )
    );
  };

  // Function to create the deck with the flashcards and send it to the backend
  const createDeckHandler = async (): Promise<void> => {
    let organizationsBody = {
      organisations: [] as number[],
    };

    if (selectedOrganizations.length > 0) {
      organizationsBody.organisations = selectedOrganizations.map(
        (org) => org.id
      );
    }

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
        organizations: organizationsBody.organisations,
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

  const fetchAllOwnedOrganizations = async (accessToken: string) => {
    try {
      const response = await fetchApi(
        "GET",
        "user/organizations",
        null,
        accessToken
      );
      if (response.status === 200) {
        const allOrganizations = response.data
          .owned_organizations as Organization[];
        setOrganizations(allOrganizations);

        // Find the default organization based on organizationName
        if (organizationName) {
          const defaultOrganization = allOrganizations.find(
            (org) => org.name === organizationName
          );
          if (defaultOrganization) {
            setSelectedOrganizations([defaultOrganization]);
          }
        }

        // Filter the organizations to exclude the selected ones
        setFilteredOrganizations(
          allOrganizations.filter((org) => !selectedOrganizations.includes(org))
        );
      } else {
        toast({ description: response.data.message });
      }
    } catch (error) {
      toast({ description: error.message });
    }
  };

  useEffect(() => {
    if (accessToken && name) {
      fetchLabelsAndDeckData(id, accessToken);
      fetchAllOwnedOrganizations(accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, name, loading]);

  // Update filtered organizations when selected organizations change
  useEffect(() => {
    setFilteredOrganizations(
      organizations.filter(
        (org) =>
          !selectedOrganizations.some((selected) => selected.id === org.id)
      )
    );
  }, [selectedOrganizations, organizations]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4 text-3xl">
        {id ? "Edit Deck" : "Create Deck"}
      </h1>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="nameDeck">Deck name</Label>
        <Input
          id="nameDeck"
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
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        {organizations.length > 0 && (
          <div className="flex items-center gap-3">
            <div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Info className="hover:text-slate-500" size={30} />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="text-lg font-bold">Organizations</div>
                  <div className="text-sm">
                    Select the organizations that will have access to this deck.
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="min-w-50">
              <Autocomplete
                multiple
                id="organizations"
                options={filteredOrganizations}
                disableCloseOnSelect
                defaultValue={selectedOrganizations}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setSelectedOrganizations(newValue);
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={<Square />}
                        checkedIcon={<SquareCheck />}
                        style={{ marginRight: 4 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  );
                }}
                className="min-w-48 max-w-96"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Organizations"
                    placeholder="College Saint Exupery"
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        {flashcardList.map((flashcard, i) => (
          <React.Fragment key={flashcard.id}>
            <Separator className="my-2" />
            <div className="text-center">
              Flashcard {i + 1} of {flashcardList.length}
            </div>
            <CreateFlashcard
              id={flashcard.id}
              flashcard={flashcard}
              index={i + 1}
              flashcardsSize={flashcardList.length}
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
        <Button
          onClick={createDeckHandler}
          variant="default"
          className="bg-green-500 hover:bg-green-400"
        >
          {id ? "Edit Deck" : "Create Deck"}
        </Button>
      </div>
    </div>
  );
};

export default CreateDeckPage;
