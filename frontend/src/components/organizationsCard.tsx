import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Organization } from '@/types/organization.type';
import { getColorClass } from '@/utils/tagscolor';
import { useNavigate } from 'react-router-dom';
import { CircleOff } from 'lucide-react';

const OrganizationsCard = ( organization: Organization  ) => {

  const navigation = useNavigate();

  const handleClick = () => {
    navigation(`/organizations/${organization.id}`);
  };

  console.log(organization);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105">
        <CardHeader>
          <CardTitle>{organization.name}</CardTitle>
          <CardDescription>{organization.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {organization.tags.length == 0 && (
            <>
              <p className="text-amber-400 font-medium flex gap-3">
                <CircleOff /> This organization is empty.
              </p>
            </>
          )}

          {organization.tags.map((tag, index) => (
            <p
              key={index}
              className={cn(
                "p-1 ps-2 pe-2 rounded-lg font-medium text-sm",
                getColorClass(tag)
              )}
            >
              {tag}
            </p>
          ))}
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