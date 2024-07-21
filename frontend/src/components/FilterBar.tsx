import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getLabels = async () => {
  const response = await fetchApi("GET", "tags");
  return response;
};

type FilterBarProps = {
  onSearch: (searchValues: any) => void;
  board?: boolean;
};

const FilterBar = ({ onSearch, board }: FilterBarProps) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const [isPublic, setIsPublic] = useState("");
  const [searchValues, setSearchValues] = useState<any>({});

  const getFormLabels = async () => {
    const response = await getLabels();
    if (response.status === 200) {
      const data = await response.data;
      setLabels(data);
    } else {
      const data = await response.data;
      toast({ description: data.message });
    }
  };

  const buildQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== "" && params[key] !== null)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setSearchValues({
      name,
      owner,
      tag: label === "none" ? "" : label,
      type: type === "none" ? "" : type,
      isPublic:
        isPublic === "public" ? true : isPublic === "private" ? false : null,
    });

    const queryString = buildQueryString(searchValues);
    onSearch(queryString);
  };

  const resetValues = () => {
    setName("");
    setOwner("");
    setLabel("");
    setType("");
    setIsPublic("");
    setSearchValues("");
  };

  useEffect(() => {
    getFormLabels();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row items-center w-full gap-2 bg-slate-300/20 rounded-lg  md:mb-2 md:p-4 p-8 "
    >
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Cards name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="owner">Owner</Label>
        <Input
          id="owner"
          placeholder="Owner name"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </div>
      <div className={`flex-1 w-full md:w-auto ${board ? "" : "hidden"}`}>
        <Label htmlFor="isPublic">Visibility</Label>
        <Select value={isPublic} onValueChange={setIsPublic}>
          <SelectTrigger>
            <SelectValue placeholder="Select a visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Quiz">Quizzes</SelectItem>
              <SelectItem value="Deck">Decks</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="label">Tag</Label>
        <Select value={label} onValueChange={(e) => setLabel(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {labels.map((label) => (
                <SelectItem key={label.id} value={label.name}>
                  {label.name}
                </SelectItem>
              ))}
              <SelectItem key="none" value="none">
                None
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="mt-auto w-full md:w-auto bg-green-500 hover:bg-green-400"
      >
        <Search />
      </Button>
      <Button onClick={resetValues} className="mt-auto w-full md:w-auto">
        <RotateCcw />
      </Button>
    </form>
  );
};

export default FilterBar;
