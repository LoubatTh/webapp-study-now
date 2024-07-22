import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../lib/form/quizz.form";
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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import useQCMStore from "../../lib/stores/quizzStore";
import type { QCM, Quizz } from "../../types/quizz.type";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { useEffect } from "react";

type CreateQCMProps = {
  id: number;
  quizz?: Quizz;
  index: number;
  qcmsSize: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onDelete: () => void;
};

const CreateQCM = ({
  id,
  quizz,
  index,
  qcmsSize,
  collapsed,
  onToggleCollapse,
  onDelete,
}: CreateQCMProps) => {
  //Use the useQCMStore store to save the QCM
  const { saveQCM } = useQCMStore();

  //Form validator with zod for the QCM
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer1: "",
      isValidAnswer1: false,
      answer2: "",
      isValidAnswer2: false,
      answer3: "",
      isValidAnswer3: false,
      answer4: "",
      isValidAnswer4: false,
    },
  });

  //Function to count the number of valid answers
  const numberOfValidAnswers = () => {
    return [
      form.getValues().isValidAnswer1,
      form.getValues().isValidAnswer2,
      form.getValues().isValidAnswer3,
      form.getValues().isValidAnswer4,
    ].filter((isValid) => isValid).length;
  };

  //Function to submit the form with the values of the QCM
  function onSubmit(values: z.infer<typeof formSchema>) {
    const body: QCM = {
      id,
      question: values.question,
      answers: [
        { answer: values.answer1, isValid: values.isValidAnswer1 },
        { answer: values.answer2, isValid: values.isValidAnswer2 },
        { answer: values.answer3, isValid: values.isValidAnswer3 },
        { answer: values.answer4, isValid: values.isValidAnswer4 },
      ],
    };
    console.log(body);
    saveQCM(body);
    onToggleCollapse();
  }

  useEffect(() => {
    if (quizz) {
      form.setValue("question", quizz.question);
      if (quizz.answers) {
        quizz.answers.map((answer, i) => {
          form.setValue(`answer${i + 1}`, answer.answer);
          form.setValue(`isValidAnswer${i + 1}`, answer.isValid);
        });
      }
    }
  }, []);

  return (
    <div className="flex flex-col max-w-full border bg-slate-400/15 rounded-md p-4 backdrop-blur-xl">
      {collapsed ? (
        <div className="flex flex-col gap-2">
          <Label className="text-md truncate">
            Question: {form.getValues().question}
          </Label>
          <Label className="text-md truncate">
            Valid answers: {numberOfValidAnswers()}/4
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
                  <DialogTitle>Delete QCM</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the QCM {index} of{" "}
                    {qcmsSize}?
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
              name="answer1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer 1</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-valid-answer={form.getValues().isValidAnswer1}
                      className={`${
                        form.getValues().isValidAnswer1
                          ? "border-green-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isValidAnswer1"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>is a correct answer</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer 2</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-valid-answer={form.getValues().isValidAnswer2}
                      className={`${
                        form.getValues().isValidAnswer2
                          ? "border-green-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isValidAnswer2"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>is a correct answer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer 3</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-valid-answer={form.getValues().isValidAnswer3}
                      className={`${
                        form.getValues().isValidAnswer3
                          ? "border-green-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isValidAnswer3"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>is a correct answer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer4"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer 4</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-valid-answer={form.getValues().isValidAnswer4}
                      className={`${
                        form.getValues().isValidAnswer4
                          ? "border-green-500"
                          : ""
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isValidAnswer4"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>is a correct answer</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Separator />
            <div className="flex gap-2 pb-2">
              <Button type="submit" className="w-1/2">
                Validate QCM
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-1/2">
                    Delete QCM
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete QCM</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete the QCM {index} of{" "}
                      {qcmsSize}?
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

export default CreateQCM;
