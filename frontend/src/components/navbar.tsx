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
  Earth,
  FilePlus2,
  BookPlus,
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
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";

const Navbar = () => {
  const { accessToken, isReady, logout } = useAuth();
  const [ invitations, setInvitations ] = useState(0);

  // handle click for navigation btn
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if(!isReady) return;

    const fetchInvites = async () => {
      
      const response = await fetchApi("GET","user/invites",null,accessToken);
      const data = await response.data;
      setInvitations(data.length);

    }

    fetchInvites();
  }, [isReady, accessToken]);

  return (
    <div className="flex justify-between p-2 items-center z-20">
      <div
        onClick={() => handleNavigate("/")}
        className="flex items-center cursor-pointer"
      >
        <div>
          <Image src={logo} alt="logo du site" width="w-8" height="h-8" />
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
            <NavigationMenuItem className="cursor-pointer">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => handleNavigate("/explore")}
              >
                <Earth className="mr-2 h-4 w-4" />
                Explore
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

                    {invitations > 0 && (
                    <div className="bg-amber-400 p-1 rounded-full relative bottom-1 ">
                    </div>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Create Card
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col gap-3 p-4 w-[300px]">
                      <ListItem
                        className="cursor-pointer"
                        key="createDeck"
                        title="Deck"
                        onClick={() => handleNavigate("/create-deck")}
                      >
                        Create a new Deck
                      </ListItem>
                      <ListItem
                        className="cursor-pointer"
                        key="createQuizz"
                        title="Quizz"
                        onClick={() => handleNavigate("/create-quizz")}
                      >
                        Create a new Quizz
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Create Card
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col gap-3 p-4 w-[300px]">
                      <ListItem
                        className="cursor-pointer"
                        key="createDeck"
                        title="Deck"
                        onClick={() => handleNavigate("/create-deck")}
                      >
                        Create a new Deck
                      </ListItem>
                      <ListItem
                        className="cursor-pointer"
                        key="createQuizz"
                        title="Quizz"
                        onClick={() => handleNavigate("/create-quizz")}
                      >
                        Create a new Quizz
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
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
                        onClick={() => handleNavigate("/premium")}
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
        {!accessToken ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <AlignJustify />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNavigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  <p>Home</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavigate("/explore")}>
                  <Earth className="mr-2 h-4 w-4" />
                  <p>Explore</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="bg-green-100 text-green-400"
                  onClick={() => handleNavigate("/login")}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <p>Login</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <AlignJustify />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNavigate("/")}>
                  <Home className="mr-2 h-4 w-4" />
                  <p>Home</p>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/explore")}>
                  <Earth className="mr-2 h-4 w-4" />
                  <p>Explore</p>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/board")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <p>My Boards</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate("/organizations")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <p>My Organizations</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleNavigate("/create-deck")}
                >
                  <BookPlus className="mr-2 h-4 w-4" />
                  <p>Create deck</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate("/create-quizz")}
                >
                  <BookPlus className="mr-2 h-4 w-4" />
                  <p>Create Quizz</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNavigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <p>Profile</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigate("/profil/statistics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <p>Statistics</p>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/premium")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <p>Premium</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="bg-red-100 text-red-400"
                onClick={() => {
                  handleNavigate("/");
                  logout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <p>Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
