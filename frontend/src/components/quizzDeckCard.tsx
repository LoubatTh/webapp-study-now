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
import { useUser } from "@/contexts/UserContext";
import { User } from "lucide-react";

type CommonCardProps = {
  id: number;
  Cardname: string;
  owner: string;
  tag: string;
  type: string;
  likes: number;
  isLiked: boolean;
  size?: number;
  flashcards?: Flashcard[];
  qcms?: QCM[];
  organizationName?: string;
  onDeleteCard: (id: number) => void;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  Cardname,
  owner,
  tag,
  type,
  likes,
  isLiked,
  size,
  flashcards,
  qcms,
  organizationName,
  onDeleteCard,
}: CommonCardProps) => {
  const navigate = useNavigate();
  const { name } = useUser();
  const [sizeCard, setSizeCard] = useState<number>(0);
  const cards = type === "Quiz" ? "quizz" : "deck";
  const itemLabel = type === "Quiz" ? "qcms" : "flashcards";

  const handleClick = () => {
    navigate(`/${cards}/${id}`);
  };

  useEffect(() => {
    if (size) {
      setSizeCard(size);
    } else if (type === "Quiz") {
      setSizeCard(qcms?.length || 0);
    } else {
      setSizeCard(flashcards?.length || 0);
    }
  }, [flashcards, qcms, type]);

  return (
    <div onClick={handleClick} className="cursor-pointer max-w-full">
      <Card
        className={cn(
          "transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105 flex flex-col gap-4 max-w-full"
        )}
      >
        <div className="flex justify-between">
          <CardHeader className="flex flex-row items-center p-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex-col ml-2 capitalize text-wrap lg:text-nowrap lg:max-w-80 xl:max-w-60">
              <CardTitle data-testid="card-name" className="md:truncate">
                {Cardname}
              </CardTitle>
              <CardDescription data-testid="card-owner" className="md:truncate">
                {owner}
              </CardDescription>
            </div>
          </CardHeader>
          <LikeButton id={id} type={type} likes={likes} isLiked={isLiked} />
        </div>
        <CardContent className="flex">
          <div className="capitalize mr-1">{cards}</div>
          <div data-testid="card-description">
            of {sizeCard} {itemLabel}
          </div>
        </CardContent>
        <CardFooter
          className={cn(
            "pt-2 pb-2 pr-2 justify-between items-center h-12",
            getColorClass(tag.toLowerCase())
          )}
        >
          <div data-testid="card-tag">{tag}</div>
          {owner === name && (
            <div className="flex h-full gap-0.5">
              <EditButton
                id={id}
                type={type}
                organizationName={organizationName}
              />
              <DeleteButton id={id} type={type} onDeleteCard={onDeleteCard} />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
