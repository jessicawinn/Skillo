import clientPromise from "@/lib/mongodb";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        if (!token || !email) {
            return new Response(JSON.stringify({ message: "Missing token or email" }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("Skillo");
        const users = db.collection("users");

        // Find user by email and token
        const user = await users.findOne({ email, verificationToken: token });
        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid verification link" }), { status: 404 });
        }

        // Mark user as verified and remove token
        await users.updateOne(
            { email },
            { $set: { isVerified: true }, $unset: { verificationToken: "" } }
        );

        return new Response(JSON.stringify({ message: "Email verified successfully!" }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
