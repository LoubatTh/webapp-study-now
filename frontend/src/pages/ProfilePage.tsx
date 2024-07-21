import React from "react";
import { useUser } from "../contexts/UserContext";
import { User, Mail, CheckCircle, XCircle, StarsIcon, StarIcon } from "lucide-react";
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
    <div className="">
      <div className="bg-red-400 w-fit">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default ProfilePage;
