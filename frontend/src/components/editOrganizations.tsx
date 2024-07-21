import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { OrganizationFormSchema } from "@/lib/form/organization.form";
import { zodResolver } from "@hookform/resolvers/zod";

const EditOrganizations = ({ org_id, baseName, baseDescription, updateOrganization }) => {

  const updateHandler = async (values) => {
    updateOrganization(org_id, values.name, values.description);
  };

  const organizationForm = useForm({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues: {
      name: baseName || "",
      description: baseDescription || "",
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit an organization</DialogTitle>
        <DialogDescription>
          Edit the name and description of the organization.
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...organizationForm}>
        <form
          className="flex flex-col gap-2"
          onSubmit={organizationForm.handleSubmit(updateHandler)}
        >
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
                <FormLabel>Description</FormLabel>
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

export default EditOrganizations;
