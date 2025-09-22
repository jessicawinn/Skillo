// app/api/courses/[courseId]/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, { params }) {
  const { courseId } = params;
  const body = await req.json();

  // List all fields you want to allow updating (except enrolledStudents)
  const {
    title,
    description,
    category,
    level,
    price,
    thumbnail,
    learningPoints,
    tools,
    status,
    rating,
    duration,
    instructorId,
    instructorName
  } = body;

  // Validate required fields
  if (!category || !level) {
    return new Response(
      JSON.stringify({ message: "Category and level required" }),
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("Skillo");
  const courses = db.collection("courses");

  // Build update object dynamically
  const updateFields = {
    ...(title && { title }),
    ...(description && { description }),
    ...(category && { category }),
    ...(level && { level }),
    ...(price !== undefined && { price }),
    ...(thumbnail && { thumbnail }),
    ...(Array.isArray(learningPoints) && { learningPoints }),
    ...(Array.isArray(tools) && { tools }),
    ...(status && { status }),
    ...(rating !== undefined && { rating }),
    ...(duration && { duration }),
    ...(instructorId && { instructorId }),
    ...(instructorName && { instructorName }),
    updatedAt: new Date(),
  };

  const result = await courses.updateOne(
    { _id: new ObjectId(courseId) },
    { $set: updateFields }
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


export async function DELETE(req, { params }) {
  const { courseId } = params;
  const client = await clientPromise;
  const db = client.db("Skillo");
  const courses = db.collection("courses");

  const result = await courses.deleteOne({ _id: new ObjectId(courseId) });

  if (result.deletedCount === 0) {
    return new Response(
      JSON.stringify({ message: "Course not found" }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify({ message: "Course deleted" }), { status: 200 });
}
