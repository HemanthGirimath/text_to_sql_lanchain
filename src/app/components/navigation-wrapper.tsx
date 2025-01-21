// app/components/client-wrapper.tsx
"use client"

import { usePathname } from 'next/navigation';
import { SidebarProvider, useSidebar } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/sidebar/sidebar";
import { Toaster } from "@/app/components/ui/toaster";
import { type ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

function NavigationContent({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  // const { isOpen, toggleSidebar: toggle } = useSidebar();
  const {toggleSidebar} = useSidebar();
  const isOpen = true
  const showSidebar = pathname.startsWith('/chat');


  // const handleMouseEnter = () => {
  //   setIsHovered(true);
  //   if (!isOpen) toggle();
  // };

  // const handleMouseLeave = (e: React.MouseEvent) => {
  //   const relatedTarget = e.relatedTarget as HTMLElement;
  //   if (relatedTarget?.closest('.dropdown-menu')) {
  //     return;
  //   }
  //   setIsHovered(false);
  //   if (isOpen) toggle();
  // };

  return (
    <div className="flex h-screen bg-black">
      {showSidebar && (
     <div 
     className="group fixed inset-y-0 left-0 z-50 flex"
    //  onMouseEnter={handleMouseEnter}
    //  onMouseLeave={handleMouseLeave}
 >
     {/* Even smaller hover trigger area */}
     <div className="w-[2px] h-full bg-zinc-800/10 hover:bg-zinc-800/20 cursor-pointer" />
     
     {/* Sidebar */}
     <div className={`w-[280px] flex-col bg-background/95 backdrop-blur-sm border-r border-zinc-800 transition-all duration-300 ease-in-out ${
         isOpen 
             ? "opacity-100 translate-x-0" 
             : "opacity-0 -translate-x-full pointer-events-none"
     }`}>
         <AppSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
     </div>
 </div>
      )}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Removed unused variable useState
  // const [state, setState] = useState(); // Uncomment if needed
  return (
    <SidebarProvider>
      <NavigationContent>{children}</NavigationContent>
      <Toaster />
    </SidebarProvider>
  );
}