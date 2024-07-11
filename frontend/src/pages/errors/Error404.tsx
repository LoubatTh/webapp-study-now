import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const Error404 = () => {

    const navigation = useNavigate();
    const handleNavigation = (path: string) => {
        navigation(path);
    }

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-red-400">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Oops! Page not found</p>
        <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
        <Button onClick={() => handleNavigation('/')} className="mt-6">Go back home</Button>
      </div>
    </div>
  );
}

export default Error404