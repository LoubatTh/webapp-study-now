import CreateOrganizations from "@/components/createOrganizations";
import InvitationCard from "@/components/invitationCard";
import OrganizationsCard from "@/components/organizationsCard";
import PageTitle from "@/components/pageTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { cardVariants } from "@/lib/animations/cardVariants";
import { InvitationType } from "@/types/invitations.type";
import { Organization } from "@/types/organization.type";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrganizationsPage = () => {
  const [organizations, setOrganizations] = useState({
    owned_organizations: [],
    organizations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [invitations, setInvitations] = useState<InvitationType[]>();
  const { isReady, accessToken } = useAuth();
  const { is_subscribed } = useUser();
  const { toast } = useToast();
  const navigation = useNavigate();

  const fetchOrganizations = async () => {
    const response = await fetchApi( "GET","user/organizations", null,accessToken);
    setOrganizations(await response.data as any);

  };
  

  const fetchInvitations = async () => {
    const response = await fetchApi("GET", "user/invites", null, accessToken);
    const data = await response.data as InvitationType[];
    setInvitations(data) 
    setIsLoading(false);
  };

  const requestInvitation = async (id: number, choice: boolean) => {
    const choiceBody = {"accept": choice};
    const response = await fetchApi("POST", `organizations/invites/${id}`, choiceBody, accessToken);
    console.log(await response);

    if (response.status !== 200) {
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      });
      return;
    }

    fetchOrganizations();
    fetchInvitations();

    toast({
      description: "Invitation " + (choice ? "accepted" : "declined"),
      className: "bg-green-400",
    });
  }

  const removeOrganization = async (id: number) => {
    const response = await fetchApi("DELETE", `organizations/${id}`,null,accessToken);

    if (response.status !== 204) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
      return;
    } 

    setOrganizations((prev) => ({
      owned_organizations: prev.owned_organizations.filter(
        (org) => org.id !== id
      ),
      organizations: prev.organizations.filter((org) => org.id !== id),
    }));

    toast({
      title: "Success",
      description: "Organization deleted",
      className: "bg-green-400",
    })
  };

  const updateOrganization = async (id: number, name: string, description: string) => {
    const response = await fetchApi("PUT", `organizations/${id}`, {"name": name, "description": description}, accessToken);
    const status = await response.status;

    if(status == 200){
      toast({
        title: "Success",
        description: "Organization updated",
        className: "bg-green-400",
      })
      fetchOrganizations();
    } else {
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!isReady) return;
    setIsLoading(true);
    fetchOrganizations();
    fetchInvitations();
  }, [isReady]);


  console.log("invitations", invitations);

  if (isLoading) {
    return "Loading...";
  }

  if (
    organizations.organizations.length == 0 &&
    organizations.owned_organizations.length == 0
  ) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-400">Sorry !</h1>
          <p className="text-2xl text-gray-600 mt-4">
            You don't have any organizations
            <br />
            {!invitations || invitations?.length === 0 ? (
              "or invitations"
            ) : (
              <>
                <Sheet>
                  <SheetTrigger>
                    <p className="font-semibold mt-2">
                      BUT you have{" "}
                      <span className="bg-amber-100 text-amber-400 p-1 rounded-lg cursor-pointer">
                        {invitations?.length} pending invitation
                        {invitations?.length === 1 ? "" : "s"}{" "}
                      </span>
                    </p>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader className="border-b-4 pb-4">
                      <SheetTitle>Invitations</SheetTitle>
                      <SheetDescription className="flex flex-col gap-3">
                        <p className="text-gray-600">
                          Here you can see all the invitations that user sent to
                          you, <br />
                          you can decide to accept or decline them.
                        </p>
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex flex-col gap-3 mt-3">
                      {invitations?.map((invitation, index) => (
                        <InvitationCard
                          key={index}
                          id={invitation.id}
                          created_at={invitation.created_at}
                          updated_at={invitation.updated_at}
                          user_id={invitation.user_id}
                          organization_id={invitation.organization_id}
                          requestInvitation={requestInvitation}
                        />
                      ))}
                    </div>

                  </SheetContent>
                </Sheet>
              </>
            )}
          </p>
          <p className="text-gray-500 mt-4">
            {is_subscribed ? (
              <Dialog>
                <DialogTrigger>
                  <Button>Create your first organization</Button>
                </DialogTrigger>
                <CreateOrganizations
                  onOrganizationCreated={fetchOrganizations}
                />
              </Dialog>
            ) : (
              <>
                <span
                  onClick={() => navigation("/premium")}
                  className="cursor-pointer text-blue-600 mr-1"
                >
                  Subscribe
                </span>
                to create your first organization
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {organizations.owned_organizations.length !== 0 && (
        <>
          <div className="flex justify-around items-center p-4">
            <PageTitle title="Owned Organizations" />
            <Dialog>
              <DialogTrigger>
                <Button> Create Organization </Button>
              </DialogTrigger>
              <CreateOrganizations onOrganizationCreated={fetchOrganizations} />
            </Dialog>
          </div>
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4"
            initial="initial"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {organizations.owned_organizations.map(
              (organization: Organization, index) => (
                <motion.div variants={cardVariants} key={index}>
                  <OrganizationsCard
                    id={organization.id}
                    created_at={organization.created_at}
                    updated_at={organization.updated_at}
                    name={organization.name}
                    description={organization.description}
                    owner_id={organization.owner_id}
                    owner={organization.owner}
                    tags={organization.tags}
                    removeOrganization={removeOrganization}
                    updateOrganization={updateOrganization}
                  />
                </motion.div>
              )
            )}
          </motion.div>
        </>
      )}

      {organizations.organizations.length !== 0 && (
        <>
          <PageTitle title="Joined Organizations" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            {organizations.organizations.map(
              (organization: Organization, index) => (
                <OrganizationsCard
                  key={index}
                  id={organization.id}
                  created_at={organization.created_at}
                  updated_at={organization.updated_at}
                  name={organization.name}
                  description={organization.description}
                  owner_id={organization.owner_id}
                  tags={organization.tags}
                />
              )
            )}
          </div>
        </>
      )}

      {invitations?.length !== 0 && (
        <Sheet>
          <SheetTrigger>
            <p className="font-semibold text-xl mt-2">
              You have
              <span className="bg-amber-100 text-amber-400 p-1 rounded-lg cursor-pointer">
                {invitations?.length} pending invitation
                {invitations?.length === 1 ? "" : "s"}
              </span>
            </p>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="border-b-4 pb-4">
              <SheetTitle>Invitations</SheetTitle>
              <SheetDescription className="flex flex-col gap-3">
                <p className="text-gray-600">
                  Here you can see all the invitations that user sent to you,{" "}
                  <br />
                  you can decide to accept or decline them.
                </p>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-3 mt-3">
              {invitations?.map((invitation, index) => (
                <InvitationCard
                  key={index}
                  id={invitation.id}
                  created_at={invitation.created_at}
                  updated_at={invitation.updated_at}
                  user_id={invitation.user_id}
                  organization_id={invitation.organization_id}
                  requestInvitation={requestInvitation}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default MyOrganizationsPage;
