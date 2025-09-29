import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";
import crypto from "crypto";
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

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    const result = await users.insertOne({
      name,
      email,
      password: hashPassword,
      role,
      verified: false,
      verificationToken: token,
      createdAt: new Date(),
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const verifyUrl = `${process.env.BASE_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${name},</p>
        <p>Please verify your email by clicking the button below:</p>
        <a href="${verifyUrl}" style="text-decoration:none;">
          <button style="background:#7c3aed;color:#fff;padding:10px 20px;border:none;border-radius:5px;cursor:pointer;font-size:16px;">Verify Email</button>
        </a>`,
    });

    return new Response(
      JSON.stringify({ message: "Signup successful. Please check your email to verify your account." }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
