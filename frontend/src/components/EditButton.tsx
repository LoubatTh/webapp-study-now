import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FilePen } from "lucide-react";

type EditButtonProps = {
  id: number;
  type: string;
  organizationName?: string;
};

const EditButton = ({ id, type, organizationName }: EditButtonProps) => {
  const navigate = useNavigate();

  const editHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (type === "Quiz") {
      navigate(`/quizz/${id}/edit?organization=${organizationName}`);
    } else {
      navigate(`/deck/${id}/edit?organization=${organizationName}`);
    }
  };

  return (
    <div>
      <Button
        className="p-3"
        variant="ghost"
        onClick={(event) => editHandler(event)}
      >
        <FilePen size={14} />
      </Button>
    </div>
  );
};

export default EditButton;
