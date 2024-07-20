import React, { useEffect, useState } from "react";
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
  owner: string;
  tag: string;
  type: string;
  likes: number;
  flashcards?: Flashcard[];
  qcms?: QCM[];
  organizationName?: string;
  onDeleteCard: (id: number) => void;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  owner,
  tag,
  type,
  likes,
  flashcards,
  qcms,
  organizationName,
  onDeleteCard,
}: CommonCardProps) => {
  const navigate = useNavigate();
  const [size, setSize] = useState<number>(0);
  const cards = type === "Quiz" ? "quizz" : "deck";
  const itemLabel = type === "Quiz" ? "qcms" : "flashcards";
  const handleClick = () => {
    navigate(`/${cards}/${id}`);
  };

  useEffect(() => {
    if (type === "Quiz") {
      setSize(qcms?.length || 0);
    } else {
      setSize(flashcards?.length || 0);
    }
  }, [flashcards, qcms, type]);

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
              <p className="ml-2 capitalize">{owner}</p>
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
            {size} {itemLabel}
          </CardDescription>
          <div className="flex gap-0.5">
            <EditButton id={id} type={type} organizationName={organizationName}/>
            <DeleteButton id={id} type={type} onDeleteCard={onDeleteCard} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
