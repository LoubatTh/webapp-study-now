import { ImageUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profilePictureSchema } from "@/lib/form/profilepicture.form";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/contexts/UserContext";

const ProfilePicture = () => {

    const { accessToken } = useAuth();
    const { avatar, refreshUser } = useUser();
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(profilePictureSchema),
    });

     const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("file", values.file);

       console.log(formData.get("file"));

       //TODO: Adapter fetchApi to use form data
       const response = await fetch("/api/user/avatar", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });
        const responseData = await response.json();
        
        if(response.status == 200){
            toast({
                title: "Profile picture updated",
                description: "Your profile picture has been updated successfully",
                className: "bg-green-400"
            })
            refreshUser();
        } else {
            toast({
                title: "Error",
                description: responseData.error,
                className: "bg-red-400"
            })
        }
     };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative w-24 h-24 group">
          <img
            className="object-cover w-24 h-24 rounded-full transition-all duration-150 ease-in-out grayscale-0 group-hover:grayscale group-hover:cursor-pointer"
            src={avatar}
            alt="Profile picture"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out pointer-events-none">
            <ImageUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile picture</DialogTitle>
          <DialogDescription>
            Import a new profile picture to update your profile. (.png, .jpeg)
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      className="h-44 border-4 border-dashed border-gray-300 hover:border-gray-400"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files[0])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-4">
              Save
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicture;
