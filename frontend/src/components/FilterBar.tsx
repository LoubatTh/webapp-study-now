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
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getLabels = async () => {
  const response = await fetchApi("GET", "tags");
  return response;
};

const FilterBar = ({ onSearch }) => {
  const [labels, setLabels] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("");
  const [isPublic, setIsPublic] = useState("");

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

  const onSubmit = (e) => {
    e.preventDefault();

    const searchValues = {
      name,
      owner,
      label: label === "none" ? "" : label,
      type: type === "none" ? "" : type,
      isPublic:
        isPublic === "public" ? true : isPublic === "private" ? false : null,
    };
    onSearch(searchValues);
  };

  useEffect(() => {
    getFormLabels();
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row items-center w-full gap-2"
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
      <div className="flex-1 w-full md:w-auto">
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
              <SelectItem value="quizzes">Quizzes</SelectItem>
              <SelectItem value="decks">Decks</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 w-full md:w-auto">
        <Label htmlFor="label">Label</Label>
        <Select value={label} onValueChange={(e) => setLabel(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a label" />
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
      <Button type="submit" className="mt-auto w-full md:w-auto">
        <Search />
      </Button>
    </form>
  );
};

export default FilterBar;
