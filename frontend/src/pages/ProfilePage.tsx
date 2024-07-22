import React from "react";
import { useUser } from "../contexts/UserContext";
import {
  User,
  Mail,
  CheckCircle,
  XCircle,
  StarsIcon,
  StarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/lib/form/register.form";
import { fetchApi } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { id, name, email, is_subscribed } = useUser();
  const { accessToken } = useAuth();

  const registerForm = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: name || "",
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onChangeSaved = async (values) => {
    const body = {
      name: values.username,
      email: values.email,
      password: values.password,
    };

    // TODO: A FINALISER (le back n'attends rien d'autres que le name)
    const response = await fetchApi("PUT", "user", body, accessToken);
  };

  function handleResume() {
    document.body.style.cursor = "wait";
  }

  function handleCancel() {
    document.body.style.cursor = "wait";

    try {
      const response = fetchApi("POST", "stripe/cancel", null, accessToken);
      console.log(response);
    } catch (error) {
      console.error("Error during the subscription process", error);
    } finally {
      document.body.style.cursor = "default";
    }
  }

  return (
    <div className="flex flex-grow justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <Tabs defaultValue="profile" className="w-[500px] shadow-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center mb-4">
                    <User className="mr-2 text-gray-500" />
                    <p>{name || "N/A"}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    <Mail className="mr-2 text-gray-500" />
                    <p>{email || "N/A"}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    {is_subscribed ? (
                      <StarsIcon className="mr-2 text-blue-500" />
                    ) : (
                      <XCircle className="mr-2 text-red-500" />
                    )}
                    <p
                      className={is_subscribed ? "text-blue-500 font-bold" : ""}
                    >
                      {is_subscribed ? "Premium" : "Free Subscription"}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit(onChangeSaved)}
                        className="space-y-8"
                      >
                        <CardContent className="space-y-2">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Your username"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your.email@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="********"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit">Saves Changes</Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <StarsIcon className="mr-2" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col gap-2 justify-between mt-4">
                  <p>
                    (TODO: Attendre que le back renvoie + d'infos pour améliorer
                    cette page)
                  </p>
                  <Button onClick={handleResume}>Resume</Button>
                  <p>
                    (TODO: Cancel qui fonctionne askip mais le GET du user
                    renvoie encore true pour is_subscribed donc ça marche pas
                    encore)
                  </p>
                  <Button onClick={handleCancel}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
