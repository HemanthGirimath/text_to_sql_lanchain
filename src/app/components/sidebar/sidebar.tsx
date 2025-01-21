'use client';

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { RecentChats } from "./recent-chats";
import UserProfile from "../profile/page";
import { useState } from "react";
import {schema} from '../../api/groq/schema'


interface AppSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}


export function AppSidebar({ isOpen, toggleSidebar }: AppSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <h1 className="text-lg font-semibold">Text to SQL</h1>
      </div>
      
      <div className="flex-1 overflow-auto">
        <RecentChats />
      </div>
      {/* <div className="flex text-xs w-full h-full">
                <Button onClick={toggleDrawer} className="ml-2">Show Schema</Button>
                {isDrawerOpen && (
                  <div className="drawer">
                    <pre>{schema}</pre>
                    <Button onClick={toggleDrawer}>Close</Button>
                </div>
                )}
              </div> */}
      <div className="mt-auto  p-4">
        <div className="flex items-center justify-between mb-4">
          <UserProfile />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        
        </div>
      </div>
    </div>
  );
}
