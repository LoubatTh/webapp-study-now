import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { PostQuizz } from "@/types/quizz.type";
import { fetchApi } from "@/utils/api";
import CreateQCM from "../components/quizz/CreateQCM";
import useQCMStore from "../lib/stores/quizzStore";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";

const postQuizz = async (quizz: PostQuizz, accessToken: string) => {
  const response = await fetchApi("POST", "quizzes", quizz, accessToken);
  console.log(response);
  return response;
};

const editQuizz = async (id: string, quizz: PostQuizz, accessToken: string) => {
  const response = await fetchApi("PUT", `quizzes/${id}`, quizz, accessToken);
  console.log(response);
  return response;
};

const getLabels = async () => {
  const response = await fetchApi("GET", "tags");
  return response;
};

const getQuizz = async (id: string, accessToken: string) => {
  const response = await fetchApi("GET", `quizzes/${id}`, null, accessToken);
  console.log(response);
  return response;
};

const CreateQuizzPage = () => {
  //Get the access token from the AuthContext
  const navigate = useNavigate();
  //Get the access token from the AuthContext
  const { accessToken } = useAuth();
  //Get the user from the AuthUser
  const { name } = useUser();
  //Check if its a creation page or an edition page
  const { id } = useParams();
  //Use the useQCMStore store to get the QCMs
  const { qcms, saveQCM, removeQCM, resetQCMs } = useQCMStore();
  //loading state
  const [loading, setLoading] = useState<boolean>(true);
  //State to manage the name of the quizz
  const [nameQuizz, setNameQuizz] = useState<string>("");
  //State to manage the lable of the deck
  const [label, setLabel] = useState<string>("");
  //State to manage the visibility of the quizz
  const [isPublic, setIsPublic] = useState<boolean>(false);
  //State to store the labels
  const [labels, setLabels] = useState<string[]>([]);
  //State to manage the error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  //State to manage the list of QCMs
  const [qcmList, setQcmList] = useState([{ id: 0, collapsed: false }]);

  //Function to add a new QCM to the list
  const addNewQCM = (): void => {
    setQcmList([...qcmList, { id: qcmList.length, collapsed: false }]);
  };

  //Function to delete a QCM from the list
  const deleteQCM = (id: number): void => {
    setQcmList(qcmList.filter((qcm) => qcm.id !== id));
  };

  //Function to toggle the collapse of a QCM
  const toggleCollapse = (id: number): void => {
    setQcmList(
      qcmList.map((qcm) =>
        qcm.id === id ? { ...qcm, collapsed: !qcm.collapsed } : qcm
      )
    );
  };

  //Function to get the labels for the select input
  const labelArray = async () => {
    const response = await getLabels();
    if (response.status === 200) {
      const data = await response.data;
      setLabels(data);
    } else {
      const data = await response.data;
      toast({ description: data.message });
    }
  };

  //Function to create the quizz with the QCMs and send it to the backend
  const createQuizzHandler = async (): Promise<void> => {
    if (name.length < 1) {
      setErrorMessage("The name field is required.");
      return;
    } else if (qcms.length < 1) {
      setErrorMessage("You need to add at least one QCM.");
      return;
    } else if (label === "") {
      setErrorMessage("You need to select a label.");
      return;
    } else {
      setErrorMessage("");
      const createdQuizz = {
        name,
        is_public: isPublic,
        tag_id: parseInt(label),
        qcms: qcms,
      };

      try {
        let response;
        if (id) {
          response = await editQuizz(id, createdQuizz, accessToken);
          if (response.status === 204) {
            toast({ description: "Quizz edited successfully" });
          } else {
            throw new Error(response.error || "Failed to edit quiz");
          }
        } else {
          response = await postQuizz(createdQuizz, accessToken);
          if (response.status === 201) {
            toast({ description: "Quizz created successfully" });
          } else {
            throw new Error(response.error || "Failed to create quizz");
          }
        }
        setNameQuizz("");
        setQcmList([{ id: 0, collapsed: false }]);
        resetQCMs();
        navigate("/board");
      } catch (error: any) {
        toast({ description: error.message });
      }
    }
  };

  const getQuizzData = async (id: string, accessToken: string) => {
    const response = await getQuizz(id, accessToken);
    if (response.status === 401 || response.status === 403) {
      navigate("/");
    }
    if (response.status === 200) {
      const data = (await response.data) as PostDeck;
      if (data.owner !== name) {
        navigate("/");
      }
      console.log(name);
      console.log(data);
      setNameQuizz(data.name);
      setLabel(() => {
        const label = labels.find((label) => label.name === data.tag);
        return label ? label.id : null;
      });
      setIsPublic(data.is_public);

      const copiedQcms = data.qcms.map((qcm) => ({
        ...qcm,
        question: qcm.question,
        answers: qcm.answers,
        collapsed: true,
      }));

      copiedQcms.forEach((qcm) => {
        saveQCM(qcm);
      });

      setQcmList(copiedQcms);
    }
    setLoading(false);
  };

  useEffect(() => {
    labelArray();
    if (id && accessToken && loading && name) {
      getQuizzData(id, accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, loading, name]);
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">Create Quizz</h1>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Quizz name</Label>
        <Input
          id="name"
          type="text"
          placeholder="My Quizz name"
          value={nameQuizz}
          onChange={(e) => setNameQuizz(e.target.value)}
        />
        {errorMessage && (
          <div className="text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="max-w-3xl min-w-full md:min-w-[768px] p-2">
        <Select value={label} onValueChange={(e) => setLabel(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a label" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {labels.map((label) => (
                <SelectItem key={label.id} value={label.id}>
                  {label.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="name">Visibility</Label>
        <div className="flex gap-2">
          <Switch
            checked={isPublic}
            onCheckedChange={() => setIsPublic(!isPublic)}
          />
          <div>{isPublic ? "Public" : "Private"}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        {qcmList.map((qcm, i) => (
          <React.Fragment key={qcm.id}>
            <Separator className="my-2" />
            <div className="text-center">
              QCM {i + 1} of {qcmList.length}
            </div>
            <CreateQCM
              id={qcm.id}
              quizz={qcm}
              index={i + 1}
              qcmsSize={qcmList.length}
              collapsed={qcm.collapsed}
              onToggleCollapse={() => toggleCollapse(qcm.id)}
              onDelete={() => deleteQCM(qcm.id)}
            />
          </React.Fragment>
        ))}
        <Button onClick={addNewQCM} variant="default" className="mt-2">
          Add New QCM
        </Button>
        <Separator className="my-2" />
        <Button onClick={createQuizzHandler} variant="default">
          Create Quizz
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizzPage;
