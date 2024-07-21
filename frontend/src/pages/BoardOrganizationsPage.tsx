import PageTitle from "@/components/pageTitle";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { cardVariants } from "@/lib/animations/cardVariants";
import { Deck } from "@/types/deck.type";
import { Quizz } from "@/types/quizz.type";
import { fetchApi } from "@/utils/api";
import { motion, MotionConfig } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import {
  Form,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PageTitle from "@/components/pageTitle";
import QuizzDeckCard from "@/components/quizzDeckCard";
import { useAuth } from "@/contexts/AuthContext";
import { cardVariants } from "@/lib/animations/cardVariants";
import { Deck } from "@/types/deck.type";
import { Quizz } from "@/types/quizz.type";
import { fetchApi } from "@/utils/api";
import { motion, MotionConfig } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FormProvider, set, useForm } from "react-hook-form";
import {
  Form,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ReactLoading from "react-loading";
import { Organization } from "@/types/organization.type";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  FilePlus,
  UserPlus,
  UserPlus2,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUsersSchema } from "@/lib/form/adduser.form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrganizationMember from "@/components/organizationMember";
import { useToast } from "@/components/ui/use-toast";
import { Organization } from "@/types/organization.type";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  FilePlus,
  UserPlus,
  UserPlus2,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUsersSchema } from "@/lib/form/adduser.form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import OrganizationMember from "@/components/organizationMember";
import { useToast } from "@/components/ui/use-toast";

const BoardOrganizationPage = () => {
  const { accessToken, isReady } = useAuth();
  const { id } = useUser();
  const { toast } = useToast();
const BoardOrganizationPage = () => {
  const { accessToken, isReady } = useAuth();
  const { id } = useUser();
  const { toast } = useToast();

  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization>();
  const [members, setMembers] = useState<string[]>([]);
  const { organizationId } = useParams();
  const [organization, setOrganization] = useState<Organization>();
  const [members, setMembers] = useState<string[]>([]);

  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState<Quizz[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState<Quizz[]>([]);
  const [allCards, setAllCards] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  const addUserForm = useForm({
    resolver: zodResolver(addUsersSchema),
    defaultValues: {
      email: "",
    },
  });
  const addUserForm = useForm({
    resolver: zodResolver(addUsersSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleNavigation = (path: string) => {
    navigation(path);
  };
  const handleNavigation = (path: string) => {
    navigation(path);
  };

  const handleDeleteCard = (id: number) => {
    setDecks((prev) => prev.filter((card) => card.id !== id));
    setQuizzes((prev) => prev.filter((card) => card.id !== id));
  };
  const handleDeleteCard = (id: number) => {
    setDecks((prev) => prev.filter((card) => card.id !== id));
    setQuizzes((prev) => prev.filter((card) => card.id !== id));
  };

  const handleRemoveUser = async (id_member: number) => {
    const response = await fetchApi(
      "DELETE",
      `organizations/${organizationId}/users/${id_member}`,
      null,
      accessToken
    );
    const status = await response.status;
  const handleRemoveUser = async (id_member: number) => {
    const response = await fetchApi(
      "DELETE",
      `organizations/${organizationId}/users/${id_member}`,
      null,
      accessToken
    );
    const status = await response.status;

    if (status !== 204) {
      toast({
        title: "Error",
        description: "An error occured while removing the user",
        variant: "destructive",
      });
      return;
    } else {
      setMembers((prev) => prev.filter((member) => member.id !== id_member));
      toast({
        title: "Success",
        description: "User removed",
        className: "bg-green-400",
      });
    }
  };
    if (status !== 204) {
      toast({
        title: "Error",
        description: "An error occured while removing the user",
        variant: "destructive",
      });
      return;
    } else {
      setMembers((prev) => prev.filter((member) => member.id !== id_member));
      toast({
        title: "Success",
        description: "User removed",
        className: "bg-green-400",
      });
    }
  };

  useEffect(() => {
    if (!isReady) return;
  useEffect(() => {
    if (!isReady) return;

    const fetchData = async () => {
      //Get Organization
      let response = await fetchApi(
        "GET",
        `organizations/${organizationId}`,
        null,
        accessToken
      );
      const organization = await response.data;

      //Get Quizzes
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/quizzes`,
        null,
        accessToken
      );
      const quizzes = (await response.data) as Quizz[];
    const fetchData = async () => {
      //Get Organization
      let response = await fetchApi(
        "GET",
        `organizations/${organizationId}`,
        null,
        accessToken
      );
      const organization = await response.data;

      //Get Quizzes
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/quizzes`,
        null,
        accessToken
      );
      const quizzes = (await response.data) as Quizz[];

      //Get Decks
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/decks`,
        null,
        accessToken
      );
      const decks = (await response.data) as Deck[];
      //Get Decks
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/decks`,
        null,
        accessToken
      );
      const decks = (await response.data) as Deck[];

      //Get Members
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/users`,
        null,
        accessToken
      );
      const members = (await response.data.members) as string[];
      //Get Members
      response = await fetchApi(
        "GET",
        `organizations/${organizationId}/users`,
        null,
        accessToken
      );
      const members = (await response.data.members) as string[];

      setMembers(members);
      setOrganization(organization as Organization);
      setQuizzes(quizzes);
      setDecks(decks);
      setLoading(false);
    };
      setMembers(members);
      setOrganization(organization as Organization);
      setQuizzes(quizzes);
      setDecks(decks);
      setLoading(false);
    };

    fetchData();
  }, [isReady]);
    fetchData();
  }, [isReady]);

  const inviteUser = async (values) => {
    const response = await fetchApi(
      "POST",
      `organizations/${organizationId}/users`,
      values,
      accessToken
    );
    const data = await response.data;
    const status = await response.status;

    if (status !== 201) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
      return;
    }
  const inviteUser = async (values) => {
    const response = await fetchApi(
      "POST",
      `organizations/${organizationId}/users`,
      values,
      accessToken
    );
    const data = await response.data;
    const status = await response.status;

    if (status !== 201) {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "User invited successfully",
      className: "bg-green-400",
    });
  };
    toast({
      title: "Success",
      description: "User invited successfully",
      className: "bg-green-400",
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <ReactLoading type={"spin"} color={"#2563EB"} />
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <ReactLoading type={"spin"} color={"#2563EB"} />
        </div>
      </div>
    );
  }

  if (quizzes.length == 0 && decks.length == 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-400">Sorry !</h1>
          <p className="text-2xl text-gray-600 mt-4">
            This organization doesn't have any quizzes or decks
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {organization?.owner_id === id && (
              <>
                <Button
                  className="flex gap-2"
                  onClick={() =>
                    handleNavigation(
                      `/create-quizz?organization=${organization.name}`
                    )
                  }
                >
                  <FilePlus size={20} /> Quizz
                </Button>
                <Button
                  className="flex gap-2"
                  onClick={() =>
                    handleNavigation(
                      `/create-deck?organization=${organization.name}`
                    )
                  }
                >
                  <FilePlus size={20} />
                  Deck
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  if (quizzes.length == 0 && decks.length == 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-400">Sorry !</h1>
          <p className="text-2xl text-gray-600 mt-4">
            This organization doesn't have any quizzes or decks
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {organization?.owner_id === id && (
              <>
                <Button
                  className="flex gap-2"
                  onClick={() =>
                    handleNavigation(
                      `/create-quizz?organization=${organization.name}`
                    )
                  }
                >
                  <FilePlus size={20} /> Quizz
                </Button>
                <Button
                  className="flex gap-2"
                  onClick={() =>
                    handleNavigation(
                      `/create-deck?organization=${organization.name}`
                    )
                  }
                >
                  <FilePlus size={20} />
                  Deck
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle title={`${organization?.name}'s board`} />
      <p className="text-center">{organization?.description}</p>
  return (
    <>
      <PageTitle title={`${organization?.name}'s board`} />
      <p className="text-center">{organization?.description}</p>

      <div className="flex justify-around items-center p-4">
        <ChevronLeft
          onClick={() => window.history.back()}
          className="cursor-pointer hover:text-slate-500"
        />
      <div className="flex justify-around items-center p-4">
        <ChevronLeft
          onClick={() => window.history.back()}
          className="cursor-pointer hover:text-slate-500"
        />

        <div className="flex flex-raw gap-4">
          <Sheet>
            <SheetTrigger>
              <Button className="flex gap-2">
                <Users />
                {organization?.owner_id === id ? "Manage" : "See members"}
              </Button>
            </SheetTrigger>
            <SheetContent>
              {organization?.owner_id === id && (
                <SheetHeader>
                  <SheetTitle>Manage organization members</SheetTitle>
                  <SheetDescription className="flex flex-col gap-3">
                    <p className="text-gray-600">
                      You can invite members to join the organization, Just put
                      their email and they will receive an invitation to join
                      the organization
                    </p>

                    <FormProvider {...addUserForm}>
                      <form onSubmit={addUserForm.handleSubmit(inviteUser)}>
                        <FormField
                          control={addUserForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="john.doe@gmail.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="mt-4 flex w-fit gap-2">
                          <UserPlus2 size={24} />
                          Invite member
                        </Button>
                      </form>
                    </FormProvider>
                  </SheetDescription>
                </SheetHeader>
              )}
                    <FormProvider {...addUserForm}>
                      <form onSubmit={addUserForm.handleSubmit(inviteUser)}>
                        <FormField
                          control={addUserForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="john.doe@gmail.com"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="mt-4 flex w-fit gap-2">
                          <UserPlus2 size={24} />
                          Invite member
                        </Button>
                      </form>
                    </FormProvider>
                  </SheetDescription>
                </SheetHeader>
              )}

              {members.length > 0 && (
                <>
                  {organization?.owner_id === id && (
                    <div className="border-t-4 mt-4"></div>
                  )}
                  <p className="flex gap-2 mt-3 font-semibold bg-slate-200 rounded-lg p-2">
                    <Users className="ml-2" /> {members.length} members
                  </p>
                  <div className="flex flex-col gap-3 mt-3">
                    {members.map((member, index) => (
                      <OrganizationMember
                        key={index}
                        id={member.id}
                        name={member.name}
                        pending={false}
                        is_owner={id === organization?.owner_id}
                        onRemoveUser={handleRemoveUser}
                      />
                    ))}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
          {organization?.owner_id === id && (
            <>
              <Button
                className="flex gap-2"
                onClick={() =>
                  handleNavigation(
                    `/create-quizz?organization=${organization.name}`
                  )
                }
              >
                <FilePlus size={20} /> Quizz
              </Button>
              <Button
                className="flex gap-2"
                onClick={() =>
                  handleNavigation(
                    `/create-deck?organization=${organization.name}`
                  )
                }
              >
                <FilePlus size={20} />
                Deck
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
        {quizzes.map((quizz, index) => (
          <QuizzDeckCard
            key={index}
            id={quizz.quiz.id}
            Cardname={quizz.quiz.name}
            owner={quizz.quiz.owner}
            tag={quizz.quiz.tag}
            likes={quizz.quiz.likes}
            isLiked={quizz.quiz.is_liked}
            type={quizz.quiz.type}
            organizationName={organization?.name}
            qcms={quizz.quiz.qcms}
            onDeleteCard={handleDeleteCard}
          />
        ))}

        {decks.map((deck, index) => (
          <QuizzDeckCard
            key={index}
            id={deck.deck.id}
            Cardname={deck.deck.name}
            owner={deck.deck.owner}
            tag={deck.deck.tag}
            likes={deck.deck.likes}
            isLiked={deck.deck.is_liked}
            type={deck.deck.type}
            organizationName={organization?.name}
            flashcards={deck.deck.flashcards}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </div>
    </>
  );
};

export default BoardOrganizationPage;
export default BoardOrganizationPage;
