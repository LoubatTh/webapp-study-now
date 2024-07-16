import CreateOrganizations from "@/components/createOrganizations";
import OrganizationsCard from "@/components/organizationsCard";
import PageTitle from "@/components/pageTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { cardVariants } from "@/lib/animations/cardVariants";
import { Organization } from "@/types/organization.type";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const MyOrganizationsPage = () => {
  const [organizations, setOrganizations] = useState({
    owned_organizations: [],
    organizations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isReady, accessToken } = useAuth();
  const { is_subscribed } = useUser();
  const { toast } = useToast();
  const navigation = useNavigate();

  const fetchOrganizations = async () => {
    if (!isReady) return;

    const response = await fetchApi(
      "GET",
      "user/organizations",
      null,
      accessToken
    );
    setOrganizations(await response.data as any);
    setIsLoading(false);
  };

  const removeOrganization = async (id: number) => {
    const response = await fetchApi(
      "DELETE",
      `organizations/${id}`,
      null,
      accessToken
    );

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

  useEffect(() => {
    fetchOrganizations();
  }, [isReady]);

  if (isLoading) {
    return <div>Loading...</div>;
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
                    tags={organization.tags}
                    removeOrganization={removeOrganization}
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
            {organizations.organizations.map((organization: Organization, index) => (
              <OrganizationsCard
                key={index}
                id={organization.id}
                created_at={organization.created_at}
                updated_at={organization.updated_at}
                name={organization.name}
                description={organization.description}
                owner_id={organization.owner_id}
                tags={organization.tags}
                removeOrganization={removeOrganization}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MyOrganizationsPage;
