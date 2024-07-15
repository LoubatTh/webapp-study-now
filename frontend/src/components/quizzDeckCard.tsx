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

// set type for quizz and deck
// type CardDataType = QuizzType | DeckType;

type CommonCardProps = {
  id?: number;
  name: string;
  tag: string;
  type: string;
  likes: number;
  is_public?: boolean;
  is_organization?: boolean;
};

const QuizzDeckCard: React.FC<CommonCardProps> = ({
  id,
  name,
  tag,
  type,
  likes,
  is_organization,
  is_public,
}: CommonCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${type}/${id}`);
  };

  return (
      <div onClick={handleClick} className="cursor-pointer">
        <Card className={cn("transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105")}>
          <CardHeader>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
              {type === "quizz" ? "Quizz" : "Deck"}
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
