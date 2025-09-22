"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user || null;

  const handleAuthClick = () => {
    if (user) {
      return;
    } else {
      signIn("google", { callbackUrl: "/" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-bold text-xl text-foreground hover:text-primary">
          <span className="text-primary">🎥</span>
          MovieFinder
        </a>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-foreground">{user.name || "User"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email || "No email"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="mr-2">👤</span>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">❤️</span>
                  <span>Favorites</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="mr-2">⚙️</span>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <span className="mr-2">🚪</span>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleAuthClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}