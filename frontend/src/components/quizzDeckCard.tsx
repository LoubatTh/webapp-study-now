import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getColorClass } from "@/utils/tagscolor";
import { cn } from "@/lib/utils";
import EditButton from "./EditButton";

type CommonCardProps = {
  id: number;
  name: string;
  tag: string;
  type: string;
  likes: number;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  tag,
  type,
  likes,
}: CommonCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const cards = type === "Quiz" ? "quizz" : "deck";
    navigate(`/${cards}/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card
        className={cn(
          "transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105"
        )}
      >
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{name}</CardTitle>
            <div>
              <EditButton id={id} type={type} />
            </div>
          </div>
          <CardDescription>
            {type === "Quiz" ? "Quizz" : "Deck"}
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
          <div className="flex items-center">
            <p className="mr-1">{likes}</p>
            <Heart className="text-red-500" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizzDeckCard;
