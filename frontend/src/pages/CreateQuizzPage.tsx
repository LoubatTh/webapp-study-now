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
import { Check, Cross, Info, Square, SquareCheck } from "lucide-react";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
  //Get the name of the organization from the search params
  const organizationName = searchParams.get("organization");
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
  //State to manage selected organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  // State to manage the selected organizations
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);
  // State to manage the filtered organizations for the autocomplete
  const [filteredOrganizations, setFilteredOrganizations] = useState<
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
    console.log("selected organizations");

    let organizationsBody = {
      organisations: [] as number[],
    };

    if (selectedOrganizations.length > 0) {
      organizationsBody.organisations = selectedOrganizations.map(
        (org) => org.id
      );
    }

    console.log(organizationsBody);

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

  const fetchAllOwnedOrganizations = async (accessToken: string) => {
    try {
      const response = await fetchApi(
        "GET",
        "user/organizations",
        null,
        accessToken
      );
      if (response.status === 200) {
        const allOrganizations = response.data
          .owned_organizations as Organization[];
        setOrganizations(allOrganizations);

        if (organizationName) {
          const defaultOrganization = allOrganizations.find(
            (org) => org.name === organizationName
          );
          if (defaultOrganization) {
            setSelectedOrganizations([defaultOrganization]);
          }
        }

        setFilteredOrganizations(
          allOrganizations.filter((org) => !selectedOrganizations.includes(org))
        );
      } else {
        toast({ description: response.data.message });
      }
    } catch (error) {
      toast({ description: error.message });
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

  useEffect(() => {
    if (accessToken && name) {
      fetchLabelsAndQuizzData(id, accessToken);
      fetchAllOwnedOrganizations(accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, accessToken, name, loading]);

  useEffect(() => {
    setFilteredOrganizations(
      organizations.filter(
        (org) =>
          !selectedOrganizations.some((selected) => selected.id === org.id)
      )
    );
  }, [selectedOrganizations, organizations]);

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
              <div className="min-w-50">
                <Autocomplete
                  multiple
                  id="organizations"
                  options={filteredOrganizations}
                  disableCloseOnSelect
                  defaultValue={selectedOrganizations}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setSelectedOrganizations(newValue);
                  }}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <li key={key} {...optionProps}>
                        <Checkbox
                          icon={<Square />}
                          checkedIcon={<SquareCheck />}
                          style={{ marginRight: 4 }}
                          checked={selected}
                        />
                        {option.name}
                      </li>
                    );
                  }}
                  className="min-w-48 max-w-96"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Organizations"
                      placeholder="College Saint Exupery"
                    />
                  )}
                />
              </div>
            </div>
          )}
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
          {id ? "Edit Quizz" : "Create Quizz"}
        </Button>
      </div>
    </div>
  );
};

export default CreateQuizzPage;
