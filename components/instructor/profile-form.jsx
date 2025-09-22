"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";


  // Get user from sessionStorage
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    expertise: [],
    website: "",
    linkedin: "",
    twitter: "",
    credentials: "",
    avatar: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newExpertise, setNewExpertise] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    expertise: [],
    website: "",
    linkedin: "",
    twitter: "",
    credentials: "",
    avatar: ""
  });

  // Load user from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("name") || ""
      const email = sessionStorage.getItem("email") || ""
      const bio = sessionStorage.getItem("bio") || ""
      const expertise = sessionStorage.getItem("expertise") ? JSON.parse(sessionStorage.getItem("expertise")) : []
      const website = sessionStorage.getItem("website") || ""
      const linkedin = sessionStorage.getItem("linkedin") || ""
      const twitter = sessionStorage.getItem("twitter") || ""
      const credentials = sessionStorage.getItem("credentials") || ""
      const avatar = sessionStorage.getItem("avatar") || ""
      const userObj = { name, email, bio, expertise, website, linkedin, twitter, credentials, avatar }
      setUser(userObj)
      setFormData(userObj)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save to sessionStorage
    if (typeof window !== "undefined") {
      Object.entries(formData).forEach(([key, value]) => {
        sessionStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value)
      })
    }
    setIsEditing(false);
    console.log("[v0] Profile updated in sessionStorage:", formData);
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()],
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (skill) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((s) => s !== skill),
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your instructor profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              disabled={!isEditing}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <div className="flex gap-2 flex-wrap">
              {formData.expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs flex items-center gap-1">
                  {skill}
                  {isEditing && (
                    <button type="button" onClick={() => removeExpertise(skill)} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2 mt-2">
                <Input
                  id="expertise"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button type="button" onClick={addExpertise}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              disabled={!isEditing}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData((prev) => ({ ...prev, linkedin: e.target.value }))}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => setFormData((prev) => ({ ...prev, twitter: e.target.value }))}
              disabled={!isEditing}
              placeholder="https://twitter.com/yourprofile"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials</Label>
            <Textarea
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData((prev) => ({ ...prev, credentials: e.target.value }))}
              disabled={!isEditing}
              placeholder="List your credentials, certifications, etc."
            />
          </div>
          <div className="flex gap-4 mt-6">
            {isEditing ? (
              <Button type="submit">Save Changes</Button>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
            {isEditing && (
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
