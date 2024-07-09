import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  AlignJustify,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  BarChart3,
  LogIn,
  // LogOut,
  User,
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
import ImageLink from "./imageLink";
import logo from "../assets/images/Logo-T-YEP.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  // handle click for navigation btn
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex justify-between p-5 items-center shadow-lg">
      <div className="flex items-center">
        <div>
          <ImageLink
            href="/"
            src={logo}
            alt="logo du site"
            width="w-16"
            height="h-16"
          />
        </div>
        <div>
          <h3>StudyNow</h3>
        </div>
      </div>
      <div className="hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => handleNavigate("/board")}
              >
                Board
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href=""
              >
                Organizations
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Account</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col gap-3 p-4 w-[300px]">
                  <ListItem
                    key="profile"
                    title="Profile"
                    onClick={() => handleNavigate("/profile")}
                  >
                    Consult your profile
                  </ListItem>
                  <ListItem
                    key="stats"
                    title="Stats"
                    onClick={() => handleNavigate("/profile/stats")}
                  >
                    Check your statistics
                  </ListItem>
                  <ListItem
                    key="premium"
                    title="Premium"
                    onClick={() => handleNavigate("/profile/premium")}
                  >
                    Get access to premium content
                  </ListItem>
                  <ListItem
                    key="login"
                    title="Login"
                    onClick={() => handleNavigate("/login")}
                  >
                    Connect to your account or create one
                  </ListItem>
                </ul>
              </NavigationMenuContent>
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
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <a href="">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                <a href="">Statistics</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <a href="">Premium</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClipboardList className="mr-2 h-4 w-4" />
                <a href="">Board</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <a href="">Organizations</a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogIn className="mr-2 h-4 w-4" />
              <a href="">Login</a>
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
