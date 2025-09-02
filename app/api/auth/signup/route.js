import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("Skillo");
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      password: hashPassword,
      role,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "User created", userId: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
