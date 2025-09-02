export async function POST() {
  // No server session to clear because JWT is stored client-side
  // Just return a success message
  return new Response(
    JSON.stringify({ message: "Logout successful" }),
    { status: 200 }
  );
}
