// app/api/courses/[courseId]/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  const { courseId } = params;
  const body = await req.json();
  const { category, level, learningPoints, tools } = body;

  if (!category || !level) {
    return new Response(
      JSON.stringify({ message: "Category and level required" }),
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("Skillo");
  const courses = db.collection("courses");

  // Validate learningPoints and tools as arrays
  const validatedLearningPoints = Array.isArray(learningPoints) ? learningPoints : [];
  const validatedTools = Array.isArray(tools) ? tools : [];

  const result = await courses.updateOne(
    { _id: new ObjectId(courseId) },
    {
      $set: {
        category,
        level,
        learningPoints: validatedLearningPoints,
        tools: validatedTools,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Course not found" }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ message: "Course updated" }), { status: 200 });
}


export async function GET(req, { params }) {
  try {
    const { courseId } = params;
    const client = await clientPromise;
    const db = client.db("Skillo");
    const courses = db.collection("courses");

    const course = await courses.findOne({ _id: new ObjectId(courseId) });

    if (!course) {
      return new Response(JSON.stringify({ message: "Course not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ course }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}
