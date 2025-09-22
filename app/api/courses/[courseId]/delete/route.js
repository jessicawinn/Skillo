import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// DELETE a specific course and its related data
export async function DELETE(req, context) {
  const { courseId } = await context.params;

  if (!courseId) {
    return new Response(
      JSON.stringify({ error: "Course ID is required" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    
    const session = client.startSession();
    
    await session.withTransaction(async () => {
      const coursesCollection = db.collection("courses");
      const enrollmentsCollection = db.collection("enrollments");
      const lessonsCollection = db.collection("lessons");
      const contentsCollection = db.collection("lesson_contents");

      // Check if course exists
      const course = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
      if (!course) {
        throw new Error("Course not found");
      }

      // Get lessons for this course
      const lessons = await lessonsCollection.find({ courseId }).toArray();
      const lessonIds = lessons.map(lesson => lesson._id.toString());

      // Delete in order: contents -> lessons -> enrollments -> course
      if (lessonIds.length > 0) {
        await contentsCollection.deleteMany({ lessonId: { $in: lessonIds } });
        await lessonsCollection.deleteMany({ courseId });
      }
      
      await enrollmentsCollection.deleteMany({ courseId });
      await coursesCollection.deleteOne({ _id: new ObjectId(courseId) });
    });

    await session.endSession();

    return new Response(
      JSON.stringify({ 
        message: "Course and all related data deleted successfully",
        deletedCourseId: courseId 
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("DELETE Course Error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}