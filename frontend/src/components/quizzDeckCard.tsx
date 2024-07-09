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

type CommonCardProps = {
  id: number;
  name: string;
  tag: string;
  type: string;
  likes: number;
  onDeleteCard: (id: number) => void;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  tag,
  type,
  likes,
  onDeleteCard,
}: CommonCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const cards = type === "Quiz" ? "quizz" : "deck";
    navigate(`/${cards}/${id}`);
  };

  return (
<<<<<<< HEAD
    <div onClick={handleClick} className="cursor-pointer">
      <Card
        className={cn(
          "transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105"
        )}
      >
        <CardHeader>
          <div className="flex justify-between">
=======
<<<<<<< HEAD
      <div onClick={handleClick} className="cursor-pointer">
        <Card className={cn("transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105")}>
          <CardHeader>
>>>>>>> 4b43e5f (feat: complete the homepage, start creating the searchbar and finish the boardpage)
            <CardTitle>{name}</CardTitle>
            <div className="flex gap-2">
              <EditButton id={id} type={type} />
              <DeleteButton id={id} type={type} onDeleteCard={onDeleteCard} />
            </div>
<<<<<<< HEAD
          </div>
          <CardDescription>
            {type === "Quiz" ? "Quizz" : "Deck"}
=======
            <div className="flex items-center">
              <p className="mr-1">{likes}</p>
              <Heart className="text-red-500" />
            </div>
          </CardFooter>
        </Card>
      </div>
=======
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition-transform duration-200 transform hover:shadow-lg hover:scale-105">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {type}
>>>>>>> 4b43e5f (feat: complete the homepage, start creating the searchbar and finish the boardpage)
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="ml-2">lulu</p>
          </div>
<<<<<<< HEAD
          <LikeButton id={id} type={type} likes={likes} isLiked={false} />
        </CardFooter>
      </Card>
    </div>
=======
          <div className="flex items-center">
            <p className="mr-1">{likes}</p>
            <Heart className="text-red-500" />
          </div>
        </CardFooter>
      </Card>
    </div>
>>>>>>> d107868 (feat: complete the homepage, start creating the searchbar and finish the boardpage)
>>>>>>> 4b43e5f (feat: complete the homepage, start creating the searchbar and finish the boardpage)
  );
};

export default QuizzDeckCard;
