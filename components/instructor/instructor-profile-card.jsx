"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Globe, Linkedin, Twitter } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function InstructorProfileCard() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {user.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push("/instructor/profile")}> <User className="h-4 w-4 mr-2" /> Edit Profile </Button>
        </div>
      </CardHeader>
      {(user.expertise?.length > 0 || user.website || user.linkedin || user.twitter) && (
        <CardContent className="pt-0">
          {user.expertise && user.expertise.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {user.expertise.slice(0, 5).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
                {user.expertise.length > 5 && (
                  <Badge variant="outline" className="text-xs">+{user.expertise.length - 5} more</Badge>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-4">
            {user.website && (
              <Button variant="ghost" size="sm" asChild>
                <a href={user.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-1" /> Website
                </a>
              </Button>
            )}
            {user.linkedin && (
              <Button variant="ghost" size="sm" asChild>
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-1" /> LinkedIn
                </a>
              </Button>
            )}
            {user.twitter && (
              <Button variant="ghost" size="sm" asChild>
                <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-1" /> Twitter
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
