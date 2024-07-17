import React, { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { fetchApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

type LikeButtonProps = {
  id: number;
  type: string;
  likes: number;
  isLiked: boolean;
};

const likeFetch = async (
  id: number,
  type: string,
  liked: boolean,
  accessToken: string
) => {
  //   const response = await fetchApi(
  //     "POST",
  //     `/${type}/${id}/like`,
  //     { liked },
  //     accessToken
  //   );
  console.log("Like response: ", liked);
};

const LikeButton = ({ id, type, likes, isLiked }: LikeButtonProps) => {
  const { accessToken } = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cards = type === "Quiz" ? "quizz" : "deck";

  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setLiked((prevLiked) => !prevLiked);
    setCurrentLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      likeFetch(id, cards, !liked, accessToken);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className="flex gap-1 hover:bg-inherit"
        onClick={handleLike}
      >
        <p>{currentLikes}</p>
        {liked ? (
          <Heart className="text-red-500 fill-red-500 hover:size-8" />
        ) : (
          <Heart className="text-red-500 hover:size-8" />
        )}
      </Button>
    </div>
  );
};

export default LikeButton;
