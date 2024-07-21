import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Organization } from '@/types/organization.type';
import { getColorClass } from '@/utils/tagscolor';
import { useNavigate } from 'react-router-dom';
import { SquareDashedMousePointer } from 'lucide-react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import DeleteOrganizations from './deleteOrganizations';

const OrganizationsCard = ( organization: Organization  ) => {

  const navigation = useNavigate();

  const handleClick = () => {
    navigation(`/organizations/${organization.id}`);
  };

  return (
    <div>
      <Card className="transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle onClick={handleClick} className="cursor-pointer">
              {organization.name}
            </CardTitle>
            {organization.removeOrganization && (
            <DeleteOrganizations
              org_id={organization.id}
              removeOrganization={organization.removeOrganization}
            />
          )}
          </div>
          <CardDescription>{organization.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {organization.tags.length == 0 && (
            <>
              <p className="text-amber-400 bg-amber-100 w-fit p-1 pr-2 pl-2 rounded-lg font-medium flex gap-3">
                <SquareDashedMousePointer /> This organization is empty.
              </p>
            </>
          )}

          <ScrollArea>
            <div className="flex w-max space-x-2 pb-5">
              {organization.tags.map((tag, index) => (
                <p
                  key={index}
                  className={cn(
                    "flex items-center p-1 ps-2 pe-2 rounded-lg font-medium text-sm",
                    getColorClass(tag)
                  )}
                >
                  {tag}
                </p>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-between">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="ml-2">Professeur</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default OrganizationsCard;