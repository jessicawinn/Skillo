"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Plus, BarChart3, User, LogOut, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export function InstructorNav() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get user info from sessionStorage
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("userName") || "Instructor";
      const email = sessionStorage.getItem("userEmail") || "";
      const avatar = sessionStorage.getItem("userAvatar") || "/placeholder.svg";
      const role = sessionStorage.getItem("role");
      if (role === "instructor") {
        setUser({ name, email, avatar });
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
    router.push("/");
  };

  if (!user) return null;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-blue-600">Skillio</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/instructor/dashboard")}> <BarChart3 className="h-4 w-4 mr-2" /> Dashboard </Button>
              <Button variant="ghost" onClick={() => router.push("/instructor/courses")}> Courses </Button>
              <Button onClick={() => router.push("/instructor/courses/new")}> <Plus className="h-4 w-4 mr-2" /> Create Course </Button>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium leading-none">{user.name}</span>
                  <span className="text-xs leading-none text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/instructor/profile")}> <User className="h-4 w-4 mr-2" /> Profile </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}> <LogOut className="h-4 w-4 mr-2" /> Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
