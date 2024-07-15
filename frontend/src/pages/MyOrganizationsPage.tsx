import CreateOrganizations from "@/components/createOrganizations";
import OrganizationsCard from "@/components/organizationsCard";
import PageTitle from "@/components/pageTitle";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { Organization } from "@/types/organization.type";
import { fetchApi } from "@/utils/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const cardVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
    },
  },
};

const MyOrganizationsPage = () => {
  const [ownedOrganizations, setOwnedOrganizations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isReady, accessToken } = useAuth();
  const { is_subscribed } = useUser();
  const navigation = useNavigate();

  const fetchOrganizations = async () => {
    if (!isReady) return;

    const response = await fetchApi(
      "GET",
      "user/organizations",
      null,
      accessToken
    );
    setOwnedOrganizations(await response.data.owned_organizations);
    setOrganizations(await response.data.organizations);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, [isReady]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (organizations.length == 0 && ownedOrganizations.length == 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-blue-400">Sorry !</h1>
          <p className="text-2xl text-gray-600 mt-4">
            You don't have any organizations
          </p>
          <p className="text-gray-500 mt-2">
            {is_subscribed ? (
              <Dialog>
                <DialogTrigger>
                  <Button className="mt-4">
                    Create your first organization
                  </Button>
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
      {ownedOrganizations.length !== 0 && (
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
            }}>
            {ownedOrganizations.map((organization: Organization, index) => (
              <motion.div variants={cardVariants}>
              <OrganizationsCard
                key={index}
                id={organization.id}
                created_at={organization.created_at}
                updated_at={organization.updated_at}
                name={organization.name}
                owner_id={organization.owner_id}
              />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {organizations.length !== 0 && (
        <>
          <PageTitle title="Joined Organizations" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            {organizations.map((organization: Organization, index) => (
              <OrganizationsCard
                key={index}
                id={organization.id}
                created_at={organization.created_at}
                updated_at={organization.updated_at}
                name={organization.name}
                owner_id={organization.owner_id}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default MyOrganizationsPage;
