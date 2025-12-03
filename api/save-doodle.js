import { put } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Missing image" }), { status: 400 });
    }

    // decode base64 → Uint8Array
    const base64 = imageBase64.replace(/^data:image\/png;base64,/, "");
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

    // unique filename
    const filename = `doodles/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;

    // save to Vercel Blob
    const { url } = await put(filename, bytes, {
      access: "public",
      contentType: "image/png"
    });

    return new Response(JSON.stringify({ success: true, url }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.toString() }), { status: 500 });
  }
}
