import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Skillo"); 
    const collections = await db.listCollections().toArray();

    console.log("Collections:", collections); 
    return new Response(JSON.stringify({ collections }), { status: 200 });
  } catch (err) {
    console.error("MongoDB error:", err); 
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
