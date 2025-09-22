// PUT update a lesson and its contents
export async function PUT(req, context) {
  const { courseId } = await context.params;
  const body = await req.json();
  const { lessonId, title, order, contents, updatedAt } = body;

  if (!courseId || !lessonId || !title || !Array.isArray(contents)) {
    return new Response(
      JSON.stringify({ error: "Course ID, lessonId, title, and contents are required" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    const lessonsCollection = db.collection("lessons");
    const contentsCollection = db.collection("lesson_contents");

    // Update lesson fields
    await lessonsCollection.updateOne(
      { _id: ObjectId.isValid(lessonId) ? new ObjectId(lessonId) : lessonId, courseId },
      {
        $set: {
          title,
          order: order || 1,
          updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        },
      }
    );

    // Remove old contents
    await contentsCollection.deleteMany({ lessonId });

    // Insert new contents
    const contentsToInsert = contents.map((c) => ({
      lessonId,
      title: c.title,
      text: c.text,
      order: c.order || 1,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    }));
    if (contentsToInsert.length > 0) {
      await contentsCollection.insertMany(contentsToInsert);
    }

    return new Response(
      JSON.stringify({ message: "Lesson updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT Lesson Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
// app/api/courses/[courseId]/lessons/route.js
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET all lessons for a specific course, including their contents
export async function GET(req, context) {
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
    const lessonsCollection = db.collection("lessons");
    const contentsCollection = db.collection("lesson_contents");

    const lessons = await lessonsCollection
      .find({ courseId })
      .sort({ order: 1 })
      .toArray();

    const lessonsWithContents = await Promise.all(
      lessons.map(async (lesson) => {
        const contents = await contentsCollection
          .find({ lessonId: lesson._id.toString() })
          .sort({ order: 1 })
          .toArray();
        return { ...lesson, contents };
      })
    );

    return new Response(
      JSON.stringify({ lessons: lessonsWithContents }),
      { status: 200 }
    );
  } catch (err) {
    console.error("GET Lessons Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// POST a new lesson with multiple contents
export async function POST(req, context) {
  const { courseId } = await context.params;

  if (!courseId) {
    return new Response(
      JSON.stringify({ error: "Course ID is required" }),
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
  const { title, order, contents, createdAt, updatedAt } = body;

    if (!title || !Array.isArray(contents) || contents.length === 0) {
      return new Response(
        JSON.stringify({ error: "Title and contents are required" }),
        { status: 400 }
      );
    }

    // Validate each content
    for (const c of contents) {
      if (!c.title || !c.text) {
        return new Response(
          JSON.stringify({ error: "Each content must have a title and text" }),
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const lessonsCollection = db.collection("lessons");
    const contentsCollection = db.collection("lesson_contents");

    // Insert the lesson
    const lessonResult = await lessonsCollection.insertOne({
      courseId,
      title,
      order: order || 1,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
    });

    const lessonId = lessonResult.insertedId.toString();

    // Insert the lesson contents
    const contentsToInsert = contents.map((c) => ({
      lessonId,
      title: c.title,
      text: c.text,
      order: c.order || 1,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    }));

    await contentsCollection.insertMany(contentsToInsert);

    return new Response(
      JSON.stringify({ message: "Lesson created successfully", lessonId }),
      { status: 201 }
    );
  } catch (err) {
    console.error("POST Lesson Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

// DELETE a lesson and its contents
export async function DELETE(req, context) {
  const { courseId } = await context.params;
  const { lessonId } = await req.json();

  if (!courseId || !lessonId) {
    return new Response(
      JSON.stringify({ error: "Course ID and Lesson ID are required" }),
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("Skillo");
    const lessonsCollection = db.collection("lessons");
    const contentsCollection = db.collection("lesson_contents");

    // Accept both ObjectId and string id
    let query = { courseId };
    if (ObjectId.isValid(lessonId)) {
      query._id = new ObjectId(lessonId);
    } else {
      query._id = lessonId;
    }

    // Delete the lesson
    const deleteLessonResult = await lessonsCollection.deleteOne(query);

    if (deleteLessonResult.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Lesson not found" }),
        { status: 404 }
      );
    }

    // Delete associated contents
    await contentsCollection.deleteMany({ lessonId });

    return new Response(
      JSON.stringify({ message: "Lesson and contents deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE Lesson Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
