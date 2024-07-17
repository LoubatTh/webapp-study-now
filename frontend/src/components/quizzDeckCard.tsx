import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getColorClass } from "@/utils/tagscolor";
import { cn } from "@/lib/utils";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import LikeButton from "./LikeButton";
import { Flashcard } from "@/types/deck.type";
import { QCM } from "@/types/quizz.type";

type CommonCardProps = {
  id: number;
  name: string;
  tag: string;
  type: string;
  likes: number;
  flashcards?: Flashcard[];
  qcms?: QCM[];
  onDeleteCard: (id: number) => void;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  tag,
  type,
  likes,
  flashcards,
  qcms,
  onDeleteCard,
}: CommonCardProps) => {
  const navigate = useNavigate();
  const cards = type === "Quiz" ? "quizz" : "deck";
  const itemCount = type === "Quiz" ? qcms?.length : flashcards?.length;
  const itemLabel = type === "Quiz" ? "qcms" : "flashcards";
  const handleClick = () => {
    navigate(`/${cards}/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card
        className={cn(
          `transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105 ${
            cards === "quizz"
              ? "ring-1 ring-electricalPurple"
              : "ring-1 ring-electricalBlue"
          }`
        )}
      >
        <CardHeader className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="ml-2 capitalize">lulu</p>
            </div>
            <LikeButton id={id} type={type} likes={likes} isLiked={false} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-2">
            <CardTitle className="capitalize">{name}</CardTitle>
          </div>
          <span
            className={cn(
              "p-1 ps-2 pe-2 rounded-lg font-medium text-sm",
              getColorClass(tag.toLowerCase())
            )}
          >
            {tag}
          </span>
        </CardContent>
        <CardFooter className="justify-between">
          <CardDescription>
            {itemCount} {itemLabel}
          </CardDescription>
          <div className="flex gap-0.5">
            <EditButton id={id} type={type} />
            <DeleteButton id={id} type={type} onDeleteCard={onDeleteCard} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
