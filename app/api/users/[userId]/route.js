import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET a specific user or instructor stats
export async function GET(req, context) {
  const { userId } = await context.params;
  const url = new URL(req.url);
  const getStats = url.searchParams.get("stats");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    
        // If stats=true, return instructor statistics
    if (getStats === "true") {
      const coursesCollection = db.collection("courses");
      const enrollmentsCollection = db.collection("enrollments");

      // Get all courses by this instructor - using instructor_id not instructorId
      const courses = await coursesCollection
        .find({ instructor_id: userId })
        .toArray();

      if (courses.length === 0) {
        return new Response(
          JSON.stringify({
            totalCourses: 0,
            totalStudents: 0,
            totalRevenue: 0
          }),
          { status: 200 }
        );
      }

      const courseIds = courses.map(course => course._id);

      // Get all enrollments for these courses
      const enrollments = await enrollmentsCollection
        .find({ courseId: { $in: courseIds } })
        .toArray();

      // Calculate stats
      const totalCourses = courses.length;
      const totalStudents = enrollments.length; // Each enrollment = 1 student
      
      // Calculate total revenue from enrollments
      let totalRevenue = 0;
      for (const enrollment of enrollments) {
        const course = courses.find(c => c._id.toString() === enrollment.courseId.toString());
        if (course && course.price) {
          // Convert price to number to avoid string concatenation
          totalRevenue += Number(course.price);
        }
      }

      return new Response(
        JSON.stringify({
          totalCourses,
          totalStudents,
          totalRevenue
        }),
        { status: 200 }
      );
    }

    // Regular user fetch
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password from response
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200 }
    );

  } catch (err) {
    console.error("GET User Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// DELETE a user (soft delete recommended)
export async function DELETE(req, context) {
  const { userId } = await context.params;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User ID is required" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    const usersCollection = db.collection("users");
    const coursesCollection = db.collection("courses");

    // Check if user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Option 1: Soft Delete (Recommended)
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          isDeleted: true, 
          deletedAt: new Date(),
          email: `deleted_${Date.now()}@deleted.com` // Prevent email conflicts
        } 
      }
    );

    // Deactivate user's courses instead of deleting
    await coursesCollection.updateMany(
      { instructor_id: userId },
      { $set: { isActive: false, deactivatedAt: new Date() } }
    );

    return new Response(
      JSON.stringify({ 
        message: "User deleted successfully (soft delete)",
        deletedUserId: userId 
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("DELETE User Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// Hard delete endpoint (use with caution)
export async function POST(req, context) {
  const { userId } = await context.params;
  const { action } = await req.json();

  if (action !== "hard_delete") {
    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    
    const session = client.startSession();
    
    await session.withTransaction(async () => {
      const usersCollection = db.collection("users");
      const coursesCollection = db.collection("courses");
      const enrollmentsCollection = db.collection("enrollments");
      const lessonsCollection = db.collection("lessons");
      const contentsCollection = db.collection("lesson_contents");

      // Get user's courses first
      const userCourses = await coursesCollection.find({ instructor_id: userId }).toArray();
      const courseIds = userCourses.map(course => course._id.toString());

      // Get lessons for these courses
      const lessons = await lessonsCollection.find({ courseId: { $in: courseIds } }).toArray();
      const lessonIds = lessons.map(lesson => lesson._id.toString());

      // Delete in order: contents -> lessons -> enrollments -> courses -> user
      if (lessonIds.length > 0) {
        await contentsCollection.deleteMany({ lessonId: { $in: lessonIds } });
      }
      
      if (courseIds.length > 0) {
        await lessonsCollection.deleteMany({ courseId: { $in: courseIds } });
        await enrollmentsCollection.deleteMany({ courseId: { $in: courseIds } });
        await coursesCollection.deleteMany({ instructor_id: userId });
      }

      // Delete user's enrollments as a student
      await enrollmentsCollection.deleteMany({ userId });

      // Finally delete the user
      const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
      
      if (result.deletedCount === 0) {
        throw new Error("User not found");
      }
    });

    await session.endSession();

    return new Response(
      JSON.stringify({ 
        message: "User and all related data deleted permanently",
        deletedUserId: userId 
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Hard DELETE User Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}