import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const instructorId = url.searchParams.get("instructorId");

        const client = await clientPromise;
        const db = client.db("Skillo");
        const courses = db.collection("courses");

        let query = {};
        if (instructorId) {
            query = { instructor_id: instructorId };
        }

        const foundCourses = await courses.find(query).toArray();

        const normalizedCourses = foundCourses.map(course => ({
            ...course,
            _id: course._id.toString(),
            instructor_id: course.instructor_id?.toString() ?? course.instructor_id,
        }));

        return new Response(
            JSON.stringify({ courses: normalizedCourses }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Failed to fetch courses" }), { status: 500 }
        );
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            image_url,
            instructor_id,
            price,
            category,
            level,
            learningPoints, // Array of bullet points
            tools           // Array of skills/tools
        } = body;

        if (!title || !description || !instructor_id || !price) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Optional: Ensure learningPoints and tools are arrays
        const validatedLearningPoints = Array.isArray(learningPoints) ? learningPoints : [];
        const validatedTools = Array.isArray(tools) ? tools : [];

        const client = await clientPromise;
        const db = client.db("Skillo");
        const courses = db.collection("courses");

        const result = await courses.insertOne({
            title,
            description,
            image_url,
            instructor_id,
            price,
            category,
            level,
            learningPoints: validatedLearningPoints,
            tools: validatedTools,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return new Response(
            JSON.stringify({ message: "Course created", courseId: result.insertedId }),
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
}

