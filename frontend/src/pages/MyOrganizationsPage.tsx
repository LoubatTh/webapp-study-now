import OrganizationsCard from "@/components/organizationsCard";
import PageTitle from "@/components/pageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { Organization } from "@/types/organization.type";
import { fetchApi } from "@/utils/api";
import { useEffect, useState } from "react";

const MyOrganizationsPage = () => {

  const [ownedOrganizations, setOwnedOrganizations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const { isReady, accessToken } = useAuth();

  useEffect(() => {
    if(!isReady) return;

    const fetchOrganizations = async () => {
      //Récupérer toutes les organisations dont l'user connecté en est l'owner.
      const response = await fetchApi("GET", "user/organizations", null, accessToken);
      setOwnedOrganizations(await response.data.owned_organizations);
      setOrganizations(await response.data.organizations);

    }

    fetchOrganizations();
  }, [isReady]);

  if(organizations.length == 0 && ownedOrganizations.length == 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl">No organizations found.</h2>
      </div>
    );
  }

  return (
    <>
      {ownedOrganizations.length !== 0 && (
        <>
          <PageTitle title="Owned Organizations" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
            {ownedOrganizations.map((organization: Organization, index) => (
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
