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

    const client = await clientPromise;
    const db = client.db("Skillo");
    const enrollments = db.collection("enrollments");

    // Check if already enrolled
    const existing = await enrollments.findOne({ userId, courseId });
    if (existing) {
      return new Response(
        JSON.stringify({ message: "User already enrolled in this course" }),
        { status: 409 }
      );
    }

    const result = await enrollments.insertOne({
      userId,
      courseId,
      instructor_id,
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

// GET: Fetch enrollments
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
    if (userId) query.userId = userId;
    if (courseId) query.courseId = courseId;

    const results = await enrollments.find(query).sort({ enrolledAt: -1 }).toArray();

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
