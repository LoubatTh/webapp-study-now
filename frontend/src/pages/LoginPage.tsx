import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroImage from "@/assets/images/hero_login_page.jpg";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "@/lib/form/login.form";
import { RegisterFormSchema } from "@/lib/form/register.form";
import { fetchApi } from "@/utils/api";
import { DataType } from "@/types/Api.type";
import { AuthTokenData, AuthRegisterData } from "@/types/AuthContext.type";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setToken } = useAuth();
  const { toast } = useToast();
  const navigation = useNavigate();

  const loginForm = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitLogin = async (values: AuthRegisterData) => {
    const response: {
      data?: AuthTokenData | string | DataType;
      status: number;
      error?: string;
    } = await fetchApi<AuthRegisterData, AuthTokenData>(
      "POST",
      "login",
      values
    );

    if (response.status != 200) {
      toast({
        title: "Identifiants incorrects",
        description: "Désolé, votre email/mot de passe ne sont pas corrects.",
        variant: "destructive",
      });
      return;
    }

    const data: AuthTokenData = response.data as AuthTokenData;
    toast({
      title: "Welcome back !",
      className: "bg-green-400",
    });
    setToken(
      data.access_token,
      data.access_token_expiration,
      data.refresh_token,
      data.refresh_token_expiration
    );

    navigation("/board");
  };

  const onSubmitRegister = async (values) => {
    const body = {
      name: values.username,
      email: values.email,
      password: values.password,
    };

    const response: {
      data?: AuthTokenData | string | DataType;
      status: number;
      error?: string;
    } = await fetchApi("POST", "register", body);

    console.log(response);
    const data: AuthTokenData = response.data as AuthTokenData;
    if (response.status != 201) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Welcome !",
      className: "bg-green-400",
    });

    setToken(
      data.access_token,
      data.access_token_expiration,
      data.refresh_token,
      data.refresh_token_expiration
    );

    navigation("/board");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md my-auto">
        <Tabs defaultValue="login" className="w-[450px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials.</CardDescription>
              </CardHeader>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onSubmitLogin)}
                  className="space-y-8"
                >
                  <CardContent className="space-y-2">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Login</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create your account</CardDescription>
              </CardHeader>
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onSubmitRegister)}
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
                            <Input placeholder="Your username" {...field} />
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
                    <Button type="submit">Register</Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden lg:flex w-1/2 items-center">
        <div className="m-4">
          <img src={heroImage} alt="Hero" className=" w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
