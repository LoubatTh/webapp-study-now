import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu-special";

import {
  AlignJustify,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  BarChart3,
  LogIn,
  LogOut,
  User,
  Home,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "./image";
import logo from "../assets/images/Logo-T-YEP.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { accessToken, logout } = useAuth();

  // handle click for navigation btn
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex justify-between p-5 items-center shadow-lg">
      <div
        onClick={() => handleNavigate("/")}
        className="flex items-center cursor-pointer"
      >
        <div>
          <Image src={logo} alt="logo du site" width="w-16" height="h-16" />
        </div>
        <div>
          <h3 className="font-bold text-xl">StudyNow</h3>
        </div>
      </div>
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="cursor-pointer">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => handleNavigate("/")}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            {accessToken ? (
              <>
                <NavigationMenuItem className="cursor-pointer">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => handleNavigate("/board")}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    My Board
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className="cursor-pointer">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => handleNavigate("/organizations")}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    My Organizations
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            ) : (
              <></>
            )}

            <NavigationMenuItem>
              {!accessToken ? (
                <NavigationMenuLink
                  className="flex items-center bg-black p-3 text-white rounded-md hover:bg-slate-800 cursor-pointer"
                  onClick={() => handleNavigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </NavigationMenuLink>
              ) : (
                <>
                  <NavigationMenuTrigger>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col gap-3 p-4 w-[300px]">
                      <ListItem
                        className="cursor-pointer"
                        key="profile"
                        title="Profile"
                        onClick={() => handleNavigate("/profile")}
                      >
                        Consult your profile
                      </ListItem>
                      <ListItem
                        className="cursor-pointer"
                        key="stats"
                        title="Stats"
                        onClick={() => handleNavigate("/profile/statistics")}
                      >
                        Check your statistics
                      </ListItem>
                      <ListItem
                        className="cursor-pointer"
                        key="premium"
                        title="Premium"
                        onClick={() => handleNavigate("/profile/premium")}
                      >
                        Get access to premium content
                      </ListItem>
                      <ListItem
                        key="Logout"
                        title="Logout"
                        onClick={() => {
                          handleNavigate("/");
                          logout();
                        }}
                        className="cursor-pointer bg-red-100 text-red-400 hover:bg-red-200 hover:text-red-500"
                      >
                        Disconnect to your account
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <AlignJustify />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <a href="">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigate("/profil/statistics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                <a href="">Statistics</a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigate("/profil/premium")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <a href="">Premium</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleNavigate("/board")}>
                <ClipboardList className="mr-2 h-4 w-4" />
                <a href="">My Boards</a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleNavigate("/organizations")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <a href="">My Organizations</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-red-100 text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <a href="">Logout</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
