import React from "react";
import { Button } from "./ui/button";
import { fetchApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type DeleteButtonProps = {
  id: number;
  type: string;
  onDeleteCard: (id: number) => void;
};

const handleDeleteFetch = async (
  id: number,
  type: string,
  accessToken: string
) => {
  const cards = type === "Quiz" ? "quizzes" : "decks";
  const response = await fetchApi(
    "DELETE",
    `${cards}/${id}`,
    null,
    accessToken
  );
  return response;
};

const DeleteButton = ({ id, type, onDeleteCard }: DeleteButtonProps) => {
  const { accessToken } = useAuth();
  const cards = type === "Quiz" ? "Quizz" : "Deck";

  const deleteHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const response = await handleDeleteFetch(id, type, accessToken);
    if (response.status === 204) {
      onDeleteCard(id);
      toast({ description: "Card delete succesfully" });
    } else {
      toast({ description: response.message });
    }
  };

  return (
    <button onClick={(event) => event.stopPropagation()}>
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="h-full p-2 rounded-md hover:bg-red-500 hover:text-background"
            onClick={(event) => event.stopPropagation()}
          >
            <Trash2 size={14} />
          </button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-md"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Delete {cards}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {cards}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteHandler(event);
                }}
                variant="destructive"
                className="w-1/2"
              >
                <div>Delete</div>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </button>
  );
};

export default DeleteButton;
