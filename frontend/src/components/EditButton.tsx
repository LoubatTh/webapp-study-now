import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type EditButtonProps = {
  id: number;
  type: string;
};

const EditButton = ({ id, type }: EditButtonProps) => {
  const navigate = useNavigate();

  const editHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (type === "Quiz") {
      navigate(`/quizz/${id}/edit`);
    } else {
      navigate(`/deck/${id}/edit`);
    }
  };

  return (
    <div>
      <Button onClick={(event) => editHandler(event)}>Edit</Button>
    </div>
  );
};

export default EditButton;
