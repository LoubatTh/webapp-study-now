import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart } from 'lucide-react';
import { Organization } from '@/types/organization.type';
import { getFormattedDate } from '@/utils/dateparser';
import { useNavigate } from 'react-router-dom';
import { getColorClass } from '@/utils/tagscolor';

const OrganizationsCard = ( organization: Organization  ) => {

  const navigation = useNavigate();

  const handleClick = () => {
    navigation(`/organizations/${organization.id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition duration-200 shadow-lg transform hover:shadow-2xl hover:scale-105">
        <CardHeader>
          <CardTitle>{organization.name}</CardTitle>
          <CardDescription></CardDescription>

        </CardHeader>
        <CardContent>

          
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