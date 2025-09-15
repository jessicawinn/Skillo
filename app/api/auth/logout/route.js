import { serialize } from "cookie";

export async function POST() {
  
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    saneSite: "lax",
    secure: false
  });

    return new Response(
    JSON.stringify({ message: "Logout successful" }),
    {
      status: 200,
      headers: { "Set-Cookie": cookie },
    }
  );
}
