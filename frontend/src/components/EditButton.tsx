import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FilePen } from "lucide-react";

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
      <Button className="p-3" onClick={(event) => editHandler(event)}>
        <FilePen size={14} />
      </Button>
    </div>
  );
};

export default EditButton;
