import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Monitor } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Navigation = () => {
  return (
    <NavigationMenu className="fixed top-4 right-4 z-50">
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem>
          <Link to="/">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Home className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Beranda</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/admin">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dashboard Admin</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/display">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tampilan Display</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;