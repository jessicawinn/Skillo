import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST: Enroll a user in a course
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, courseId, instructor_id } = body;

    if (!userId || !courseId || !instructor_id) {
      return new Response(
        JSON.stringify({ message: "userId, courseId and instructor_id are required" }),
        { status: 400 }
      );
    }

    // Validate ObjectId format
    try {
      new ObjectId(userId);
      new ObjectId(courseId);
      new ObjectId(instructor_id);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid ID format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const enrollments = db.collection("enrollments");

    // Check if already enrolled - use ObjectIds for consistency
    const existing = await enrollments.findOne({ 
      userId: new ObjectId(userId), 
      courseId: new ObjectId(courseId) 
    });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "User already enrolled in this course" }),
        { status: 409 }
      );
    }

    const result = await enrollments.insertOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      instructor_id: new ObjectId(instructor_id),
      status: "active", // default status
      enrolledAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Enrollment successful",
        enrollmentId: result.insertedId,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Enrollment Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// GET: Fetch enrollments with populated course and user data
// Optional query parameters: ?userId=... or ?courseId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    const client = await clientPromise;
    const db = client.db("Skillo");
    const enrollments = db.collection("enrollments");

    let query = {};
    
    // Handle both string and ObjectId formats for backward compatibility
    if (userId) {
      try {
        // Try both string and ObjectId formats
        query.$or = [
          { userId: userId },
          { userId: new ObjectId(userId) }
        ];
      } catch (error) {
        query.userId = userId; // Fallback to string
      }
    }
    
    if (courseId) {
      const courseQuery = [];
      try {
        courseQuery.push({ courseId: courseId });
        courseQuery.push({ courseId: new ObjectId(courseId) });
      } catch (error) {
        courseQuery.push({ courseId: courseId });
      }
      
      if (query.$or) {
        // Combine with existing $or
        query.$and = [
          { $or: query.$or },
          { $or: courseQuery }
        ];
        delete query.$or;
      } else {
        query.$or = courseQuery;
      }
    }

    const results = await enrollments.find(query).sort({ enrolledAt: -1 }).toArray();

    // Manually populate course and user data
    const courses = db.collection("courses");
    const users = db.collection("users");

    for (let enrollment of results) {
      // Get course data
      try {
        const courseId = typeof enrollment.courseId === 'string' 
          ? new ObjectId(enrollment.courseId) 
          : enrollment.courseId;
        enrollment.course = await courses.findOne({ _id: courseId });
      } catch (error) {
        enrollment.course = null;
      }

      // Get user data
      try {
        const userId = typeof enrollment.userId === 'string' 
          ? new ObjectId(enrollment.userId) 
          : enrollment.userId;
        const user = await users.findOne({ _id: userId });
        enrollment.user = user ? {
          _id: user._id,
          name: user.name,
          email: user.email
        } : null;
      } catch (error) {
        enrollment.user = null;
      }

      // Get instructor data
      try {
        const instructorId = typeof enrollment.instructor_id === 'string' 
          ? new ObjectId(enrollment.instructor_id) 
          : enrollment.instructor_id;
        const instructor = await users.findOne({ _id: instructorId });
        enrollment.instructor = instructor ? {
          _id: instructor._id,
          name: instructor.name,
          email: instructor.email
        } : null;
      } catch (error) {
        enrollment.instructor = null;
      }
    }

    return new Response(
      JSON.stringify({ enrollments: results }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Enrollment Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
