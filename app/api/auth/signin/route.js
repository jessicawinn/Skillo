import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("Skillo");
        const users = db.collection("users");

        const user = await users.findOne({ email });
        if (!user) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password" }),
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Invalid email or password" }),
                { status: 401 }
            );
        }


        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }  // token expires in 8 hours
        );

        // Set JWT as HTTP-only cookie
        const cookie = serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 8 * 60 * 60, // 8 hours in seconds
            sameSite: "lax",
            secure: false,
        });

        return new Response(
            JSON.stringify({
                message: "Signin successful",
                userId: user._id,
                role: user.role,
                name: user.name
            }),
            {
                status: 200,
                headers: { "Set-Cookie": cookie },
            }
        );

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}