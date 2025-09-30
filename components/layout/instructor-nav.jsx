"use client";
import { useEffect, useState } from "react";
import { BookOpen, Plus, BarChart3, User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function InstructorNav() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.user?.role === "instructor") {
        setUser({
          name: data.user.name || "Instructor",
          email: data.user.email || "",
          avatar: data.user.avatar || "/placeholder.svg"
        });
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (!user) return null;

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-purple-700" />
              <h1 className="text-xl font-bold text-purple-700">Skillio</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => router.push("/instructor/dashboard")}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Dashboard
              </button>
              <button 
                onClick={() => router.push("/instructor/courses")}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Courses
              </button>
              <button 
                onClick={() => router.push("/instructor/courses/new")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Course
              </button>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                <div className="px-4 py-3 border-b">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      router.push("/instructor/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </button>
                </div>
              </div>
            )}
            
            {dropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setDropdownOpen(false)}
              ></div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
