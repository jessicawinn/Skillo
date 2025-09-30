import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb"; // Import ObjectId
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
        }
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return new Response(JSON.stringify({ message: "Invalid token" }), { status: 401 });
        }
        const client = await clientPromise;
        const db = client.db("Skillo");
        const users = db.collection("users");
        // Convert userId to ObjectId for the query
        const user = await users.findOne({ _id: new ObjectId(payload.userId) });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        // Only return safe fields
        return new Response(JSON.stringify({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            }
        }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}