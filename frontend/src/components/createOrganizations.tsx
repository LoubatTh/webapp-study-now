import React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { OrganizationFormSchema } from "@/lib/form/organization.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/utils/api";
import { useToast } from "./ui/use-toast";

const CreateOrganizations = ({ onOrganizationCreated }) => {
  const { accessToken } = useAuth();
  const { toast } = useToast();

  const organizationForm = useForm({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    const organizationName = data.name;
    const organizationDescription = data.description;
    const response = await fetchApi(
      "POST",
      "organizations",
      { name: organizationName, description: organizationDescription },
      accessToken
    );

    if (response.status === 201) {
      toast({
        title: "Organization created!",
        className: "bg-green-400",
      });

      if (onOrganizationCreated) {
        onOrganizationCreated();
      } 
    } else {
      toast({
        title: "Failed to create organization",
        description: response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create an organization</DialogTitle>
        <DialogDescription>
          Create an organization to manage your projects, users, and more.
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...organizationForm}>
        <form className="flex flex-col gap-2" onSubmit={organizationForm.handleSubmit(onSubmit)}>
          <FormField
            control={organizationForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="College Saint Expury" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={organizationForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="A school in Paris" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogClose asChild>
            <Button className="mt-3 w-fit" type="submit">
              Submit
            </Button>
          </DialogClose>
        </form>
      </FormProvider>
    </DialogContent>
  );
};

export default CreateOrganizations;
