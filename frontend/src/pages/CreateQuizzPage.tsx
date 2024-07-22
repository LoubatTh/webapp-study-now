import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { PostQuizz, Quizz } from "@/types/quizz.type";
import { fetchApi } from "@/utils/api";
import CreateQCM from "../components/quizz/CreateQCM";
import useQCMStore from "../lib/stores/quizzStore";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { Tag } from "@/types/tag.type";
import { Organization } from "@/types/organization.type";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Square, SquareCheck } from "lucide-react";

const postQuizz = async (quizz: PostQuizz, accessToken: string) => {
  const response = await fetchApi("POST", "quizzes", quizz, accessToken);
  return response;
};

const editQuizz = async (id: string, quizz: PostQuizz, accessToken: string) => {
  const response = await fetchApi("PUT", `quizzes/${id}`, quizz, accessToken);
  return response;
};

const getLabels = async () => {
  const response = await fetchApi("GET", "tags");
  return response;
};

const getQuizz = async (id: string, accessToken: string) => {
  const response = await fetchApi("GET", `quizzes/${id}`, null, accessToken);
  return response;
};

const getAllOwnedOrganizations = async (accessToken: string) => {
  const response = await fetchApi(
    "GET",
    "user/organizations",
    null,
    accessToken
  );
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
  //Get the search params
  const [searchParams] = useSearchParams();
  //Get the name params
  const organizationName = searchParams.get("name");
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
  const [labels, setLabels] = useState<Tag[]>([]);
  //State to manage the error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  //State to manage the list of QCMs
  const [qcmList, setQcmList] = useState([{ id: 0, collapsed: false }]);
  //State to manage organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  //State to manage the selected organizations
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);

  //Function to add a new QCM to the list
  const addNewQCM = (): void => {
    setQcmList([...qcmList, { id: qcmList.length, collapsed: false }]);
  };

  //Function to delete a QCM from the list
  const deleteQCM = (id: number): void => {
    setQcmList(qcmList.filter((qcm) => qcm.id !== id));
    removeQCM(id);
  };

  //Function to toggle the collapse of a QCM
  const toggleCollapse = (id: number): void => {
    setQcmList(
      qcmList.map((qcm) =>
        qcm.id === id ? { ...qcm, collapsed: !qcm.collapsed } : qcm
      )
    );
  };

  //Function to create the quizz with the QCMs and send it to the backend
  const createQuizzHandler = async (): Promise<void> => {
    const organizationsBody = {
      organisations: selectedOrganizations.map(
        (organization) => organization.id
      ),
    };

    if (nameQuizz.length < 1) {
      setErrorMessage("The name field is required.");
      return;
    } else if (nameQuizz.length > 30) {
      setErrorMessage("The name field must be less than 30 characters.");
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
        name: nameQuizz,
        is_public: isPublic,
        tag_id: parseInt(label),
        organizations: organizationsBody.organisations,
        qcms: qcms,
      };

      try {
        let response;
        if (id) {
          response = await editQuizz(id, createdQuizz, accessToken);

          if (response.status === 200) {
            toast({
              description: "Quizz edited successfully",
              className: "bg-green-400",
            });
          } else {
            throw new Error(response.error || "Failed to edit quiz");
          }
        } else {
          response = await postQuizz(createdQuizz, accessToken);
          if (response.status === 201) {
            toast({
              description: "Quizz created successfully",
              className: "bg-green-400",
            });
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

  const fetchLabelsAndQuizzData = async (
    id: string | undefined,
    accessToken: string
  ) => {
    try {
      const labelsResponse = await getLabels();
      if (labelsResponse.status === 200) {
        setLabels(labelsResponse.data as Tag[]);

        if (id) {
          const quizzResponse = await getQuizz(id, accessToken);
          if (quizzResponse.status === 200) {
            const data = quizzResponse.data as Quizz;
            const matchOrganizations = organizations.filter((organization) =>
              data.organizations.includes(organization.id)
            );
            setSelectedOrganizations(matchOrganizations);

            if (data.owner !== name) {
              navigate("/");
              return;
            }
            setNameQuizz(data.name);
            const foundLabel = (labelsResponse.data as Tag[]).find(
              (label: Tag) => label.name === data.tag
            );
            setLabel(foundLabel.id);
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
          } else {
            toast({ description: quizzResponse.data.message });
          }
        }
      } else {
        toast({ description: labelsResponse.data.message });
      }
    } catch (error) {
      toast({ description: error.message });
    }
    setLoading(false);
  };

  const fetchAllOwnedOrganizations = async () => {
    try {
      const response = await getAllOwnedOrganizations(accessToken);
      if (response.status === 200) {
        setOrganizations(response.data.owned_organizations as Organization[]);
        console.log();
      } else {
        toast({ description: response.data.message });
      }
    } catch (error) {
      toast({ description: error.message });
    }
  };

  useEffect(() => {
    if (accessToken && name) {
      fetchLabelsAndQuizzData(id, accessToken);
      fetchAllOwnedOrganizations();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, name, loading, organizationName]);

  useEffect(() => {
    if (organizationName) {
      const organization = organizations.find(
        (organization) => organization.name === organizationName
      );
      if (organization) {
        setSelectedOrganizations([organization]);
      }
    }
  }, [organizationName, organizations]);

  // Fonction pour filtrer les organisations disponibles
  const getFilteredOrganizations = () => {
    return organizations.filter(
      (org) =>
        !selectedOrganizations.some((selectedOrg) => selectedOrg.id === org.id)
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="mx-auto my-4">{id ? "Edit Quizz" : "Create Quizz"}</h1>
      <div className="flex flex-col gap-3 p-2 max-w-3xl min-w-full md:min-w-[768px]">
        <Label htmlFor="nameQuizz">Quizz name</Label>
        <Input
          id="nameQuizz"
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
        <div className="flex flex-col gap-y-10">
          <div>
            <Label htmlFor="name">Visibility</Label>
            <div className="flex gap-2 mt-2">
              <Switch
                checked={isPublic}
                onCheckedChange={() => setIsPublic(!isPublic)}
              />
              <div>{isPublic ? "Public" : "Private"}</div>
            </div>
          </div>
          {organizations.length > 0 && (
            <div className="flex items-center gap-3">
              <div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Info className="hover:text-slate-500" size={30} />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="text-lg font-bold">Organizations</div>
                    <div className="text-sm">
                      Select the organizations that will have access to this
                      quizz.
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="min-w-96">
                <Autocomplete
                  multiple
                  id="organizations"
                  options={getFilteredOrganizations()}
                  getOptionLabel={(option) => option.name}
                  value={selectedOrganizations}
                  onChange={(event, newValue) => {
                    setSelectedOrganizations(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Organizations"
                      placeholder="Choose..."
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={<Square />}
                        checkedIcon={<SquareCheck />}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col max-w-full md:max-w-3xl min-w-full md:min-w-[768px] p-2">
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
        <Button
          onClick={createQuizzHandler}
          variant="default"
          className="bg-green-500 hover:bg-green-400"
        >
          {id ? "Edit Quizz" : "Create Quizz"}
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizzPage;
