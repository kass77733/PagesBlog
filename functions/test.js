export async function onRequestGet() {
  return new Response(JSON.stringify({ message: "Functions working!" }), {
    headers: { "Content-Type": "application/json" }
  });
}