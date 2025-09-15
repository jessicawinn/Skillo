import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("Skillo");
        const usersCollection = db.collection("users");

        const role = req.nextUrl.searchParams.get("role");

        const query = role ? { role } : {};

        const users = await usersCollection.find(query).toArray();
        
        return new Response(JSON.stringify({users}), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        });
    } catch (error) {
        return new Response(JSON.stringify({error : error.message}), {
            status: 500,
            headers: {"Content-Type": "application/json"}
        });
    }
}