import React from "react";
import { useUser } from "../contexts/UserContext";
import { User, Mail, CheckCircle, XCircle, StarsIcon, StarIcon, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/lib/form/register.form";
import { fetchApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { EditFormSchema } from "@/lib/form/edit.form";
import { log } from "console";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getFormattedDate, parseISODateToMilis } from "@/utils/dateparser";

const ProfilePage = () => {

    const { id, name, email, is_subscribed, refreshUser } = useUser();
    const { accessToken } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const editForm = useForm({
      resolver: zodResolver(EditFormSchema),
      defaultValues: {
        username: "",
        oldPassword: "",
        newPassword: "",
      },
    });

    const handleNavigation = (path) => {
      navigate(path);
    }

    const cancelSubscription = async () => {
      
      const response = await fetchApi("POST", "stripe/cancel", null, accessToken);
      const status = await response.status;
      const data = await response.data;

      if(status == 200){
        toast({
          title: data.message,
          description: "Will end at " + getFormattedDate(data.ends_at),
          className: "bg-green-400",
        });
      } else {
        const errorMessage = await response.error;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }

    }

    const resumeSubscription = async () => {
      const response = await fetchApi("POST", "stripe/resume", null, accessToken);
      const status = await response.status;
      const data = await response.data;

      if(status == 200){
        toast({
          title: data.message,
          className: "bg-green-400",
        });
      } else {
        const errorMessage = await response.error;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
    }
  }

    const onChangeSaved = async (values) => {

      const body = {
        name: values.username,
        password: values.oldPassword,
        new_password: values.newPassword,
      };

      console.log(body)
      const response = await fetchApi("PUT", "user", body, accessToken);
      const status = await response.status;

      if(status == 200){
        toast({
          title: "Profile updated",
          description: "Your profile has been updated",
          className: "bg-green-400",
        })
        refreshUser();
      } else {
        const errorMessage = await response.error;
        toast({
          title: "Error",
          description: errorMessage,
          className: "bg-red-400",
        });
      }

    };


return (
  <div className="flex justify-center w-full">
    <div className="flex flex-row gap-4 w-3/4 max-w-5xl">
      {/* Profile  */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <div className="flex justify-center">
          <img
            className="w-24 h-24 rounded-full"
            src="https://picsum.photos/200/300"
            alt="Profile"
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-gray-600">Student</p>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center mt-2">
            <User className="text-gray-600" />
            <span className="ml-2 text-gray-800">{name}</span>
          </div>
          <div className="flex items-center mt-2">
            <Mail className="text-gray-600" />
            <span className="ml-2 text-gray-800">{email}</span>
          </div>
          <div className="flex items-center mt-2">
            <Phone className=" text-gray-600" />
            <span className="ml-2 text-gray-800">+330000000</span>
          </div>
          <div className="flex items-center mt-2">
            {is_subscribed ? (
              <>
                <StarsIcon className="text-blue-500" />
                <span className="ml-2 text-blue-500 font-bold">
                  Premium User
                </span>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" />
                <span className="ml-2 text-gray-800">Free User</span>
              </>
            )}
          </div>
        </div>
      </div>
      <Tabs defaultValue="account" className="w-2/3">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h1 className="text-xl font-semibold mb-2">Edit profile </h1>
            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(onChangeSaved)}
                className="grid grid-cols-2 gap-4"
              >
                <FormField
                  control={editForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>New username</FormLabel>
                      <FormControl>
                        <Input placeholder={name} {...field} />
                      </FormControl>
                      <FormMessage className="min-h-6" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Old Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="min-h-6" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="min-h-6" />
                    </FormItem>
                  )}
                />
                <div className="flex items-end col-span-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
        <TabsContent value="subscription">
          <>
            <div className="bg-white rounded-lg shadow-lg p-8 h-full">
              <h1 className="text-xl font-semibold mb-2">
                Manage subscription
              </h1>
              {!is_subscribed ? (
                <div className="flex flex-col gap-4">
                  <p className="text-gray-800">
                    You are currently using the free version of our app. To
                    unlock all the features, you can subscribe to our premium
                    plan.
                  </p>
                  <Button onClick={() => handleNavigation("/premium")}>
                    Subscribe
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-800">
                      You are currently subscribed to our premium plan. You can
                      cancel your subscription at any time.
                    </p>
                    <Button onClick={cancelSubscription}>
                      Cancel Subscription
                    </Button>
                    <p className="text-gray-800">
                      You can also resume your subscription at any time.
                    </p>
                    <Button onClick={resumeSubscription}>
                      Resume Subscription
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);
};

export default ProfilePage;
