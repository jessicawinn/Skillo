import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Calculate progress percentage for a user's course
export async function GET(req, context) {
  try {
    const { courseId } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !courseId) {
      return new Response(
        JSON.stringify({ message: "userId and courseId are required" }),
        { status: 400 }
      );
    }

    // Validate ObjectId format for userId
    try {
      new ObjectId(userId);
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Invalid userId format" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    
    // Get total content count from lessons (use the same query as the lessons API)
    const lessonsCollection = db.collection("lessons");
    const contentsCollection = db.collection("lesson_contents");
    
    const lessons = await lessonsCollection
      .find({ courseId })
      .sort({ order: 1 })
      .toArray();

    // Count total contents the same way as the lessons API
    let totalContents = 0;
    for (const lesson of lessons) {
      const contents = await contentsCollection
        .find({ lessonId: lesson._id.toString() })
        .toArray();
      totalContents += contents.length;
    }
    
    console.log(`Found ${lessons.length} lessons for course ${courseId}`); // Debug log
    console.log(`Total contents: ${totalContents}`); // Debug log

    // Get completed content count from progress - try both string and ObjectId courseId
    const progressCollection = db.collection("user_progress");
    const allProgress = await progressCollection.find({
      $and: [
        { userId: new ObjectId(userId) },
        {
          $or: [
            { courseId: courseId }, // string courseId
            { courseId: new ObjectId(courseId) } // ObjectId courseId
          ]
        }
      ]
    }).toArray();
    
    // Filter progress to only include entries for lessons that actually exist
    const validLessonIds = new Set(lessons.map(lesson => lesson._id.toString()));
    const validProgress = allProgress.filter(p => validLessonIds.has(p.lessonId.toString()));
    const completedContents = validProgress.length;
    
    console.log(`Total progress entries: ${allProgress.length}`);
    console.log(`Valid progress entries: ${completedContents}`);
    console.log(`Completed contents: ${completedContents}`); // Debug log

    // Calculate percentage
    const progressPercentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

    return new Response(
      JSON.stringify({
        progressPercentage,
        completedContents,
        totalContents,
        isComplete: progressPercentage === 100
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Course Progress Error:", err);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}