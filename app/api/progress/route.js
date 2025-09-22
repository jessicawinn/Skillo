import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST: Mark content as complete
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, courseId, lessonId, contentIndex, contentTitle } = body;

    if (!userId || !courseId || !lessonId || contentIndex === undefined) {
      return new Response(
        JSON.stringify({ message: "userId, courseId, lessonId, and contentIndex are required" }),
        { status: 400 }
      );
    }

    // Validate ObjectId format
    try {
      new ObjectId(userId);
      new ObjectId(courseId);
      new ObjectId(lessonId);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid ID format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const progressCollection = db.collection("user_progress");

    // Check if already completed
    const existing = await progressCollection.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      lessonId: new ObjectId(lessonId),
      contentIndex: contentIndex
    });

    if (existing) {
      return new Response(
        JSON.stringify({ 
          message: "Content already marked as complete",
          progressId: existing._id 
        }),
        { status: 200 }
      );
    }

    // Create new progress record
    const result = await progressCollection.insertOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      lessonId: new ObjectId(lessonId),
      contentIndex: contentIndex,
      contentTitle: contentTitle || "",
      completedAt: new Date(),
      createdAt: new Date()
    });

    return new Response(
      JSON.stringify({
        message: "Progress saved successfully",
        progressId: result.insertedId
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Progress Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// GET: Fetch user progress for a course
// Query parameters: ?userId=...&courseId=...
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return new Response(
        JSON.stringify({ message: "userId and courseId are required" }),
        { status: 400 }
      );
    }

    // Validate ObjectId format
    try {
      new ObjectId(userId);
      new ObjectId(courseId);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid ID format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const progressCollection = db.collection("user_progress");

    const progress = await progressCollection
      .find({
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId)
      })
      .sort({ completedAt: 1 })
      .toArray();

    return new Response(
      JSON.stringify({ progress }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Progress Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// DELETE: Remove progress (unmark content)
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { userId, courseId, lessonId, contentIndex } = body;

    if (!userId || !courseId || !lessonId || contentIndex === undefined) {
      return new Response(
        JSON.stringify({ message: "userId, courseId, lessonId, and contentIndex are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const progressCollection = db.collection("user_progress");

    const result = await progressCollection.deleteOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      lessonId: new ObjectId(lessonId),
      contentIndex: contentIndex
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "Progress record not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Progress removed successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE Progress Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}