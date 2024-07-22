import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/form/deck.form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Flashcard } from "@/types/deck.type";
import useDeckStore from "@/lib/stores/deckStore";
import { useEffect } from "react";

type CreateFlashcardProps = {
  id: number;
  flashcard?: Flashcard;
  index: number;
  flashcardsSize: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onDelete: () => void;
};

const CreateFlashcard = ({
  id,
  flashcard,
  index,
  flashcardsSize,
  collapsed,
  onToggleCollapse,
  onDelete,
}: CreateFlashcardProps) => {
  //Use the useDeckStore store to save the flashcard
  const { saveFlashcard } = useDeckStore();

  //Form validator with zod for the flashcard
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  //Function to submit the form with the values of the flashcard
  function onSubmit(values: z.infer<typeof formSchema>) {
    const body: Flashcard = {
      id,
      question: values.question,
      answer: values.answer,
    };
    saveFlashcard(body);
    onToggleCollapse();
  }

  useEffect(() => {
    if (flashcard) {
      form.setValue("question", flashcard.question);
      form.setValue("answer", flashcard.answer);
    }
  }, []);

  return (
    <div className="flex flex-col border bg-slate-400/15 rounded-md p-4 backdrop-blur-xl">
      {collapsed ? (
        <div className="flex flex-col gap-2">
          <Label className="text-md truncate">
            Question: {form.getValues().question}
          </Label>
          <Label className="text-md truncate">
            Answer: {form.getValues().answer}
          </Label>
          <Separator />
          <div className="flex gap-2">
            <Button onClick={onToggleCollapse} className="w-1/2">
              <div className="ml-2">Edit</div>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-1/2">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete Flashcard</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the Flashcard {index} of{" "}
                    {flashcardsSize}?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      onClick={onDelete}
                      variant="destructive"
                      className="w-1/2"
                    >
                      <div>Delete</div>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="flex gap-2 pb-2">
              <Button type="submit" className="w-1/2">
                Validate Flashcard
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-1/2">
                    Delete Flashcard
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete Flashcard</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the Flashcard {index} of{" "}
                      {flashcardsSize}?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        onClick={onDelete}
                        variant="destructive"
                        className="w-1/2"
                      >
                        <div>Delete</div>
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CreateFlashcard;
