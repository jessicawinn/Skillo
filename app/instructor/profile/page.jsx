import { ProfileForm } from "@/components/instructor/profile-form"

export default function InstructorProfilePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Instructor Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information and showcase your expertise to students
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  )
}
