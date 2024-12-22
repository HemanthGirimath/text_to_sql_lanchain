'use client';

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { RecentChats } from "./recent-chats";
import UserProfile from "../profile/page";



export function AppSidebar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <h1 className="text-lg font-semibold">Text to SQL</h1>
      </div>
      
      <div className="flex-1 overflow-auto">
        <RecentChats />
      </div>

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
