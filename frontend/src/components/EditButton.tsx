import { useNavigate } from "react-router-dom";
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
    <button
      className="h-full p-2h-full p-2 rounded-md hover:bg-background hover:text-primary hover:ring-1 hover:ring-primary"
      onClick={(event) => editHandler(event)}
    >
      <FilePen size={14} />
    </button>
  );
};

export default EditButton;
