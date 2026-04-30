export async function GET() {
  return Response.json({
    message: "AI search disabled (no API key)",
  });
}