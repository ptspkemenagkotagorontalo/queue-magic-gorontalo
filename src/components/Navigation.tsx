import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard } from "lucide-react";

const Navigation = () => {
  return (
    <NavigationMenu className="fixed top-4 right-4 z-50">
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem>
          <Link to="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/admin">
            <Button variant="outline" size="icon">
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;