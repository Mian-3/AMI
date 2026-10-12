import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { getSession } from "@/lib/auth";

// Direct browser to Blob uploads, so large files (catalogue PDF, hero video) are not
// limited by the 4.5 MB request size of server functions. Only signed in admins get a token.
export async function POST(request) {
  const body = await request.json();
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getSession();
        if (!session) throw new Error("You are signed out. Please log in again.");
        return {
          allowedContentTypes: ["application/pdf", "video/mp4", "video/webm", "image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed." }, { status: 400 });
  }
}
