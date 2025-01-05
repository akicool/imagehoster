import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const isPrivate = data.get("isPrivate") === "true";

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const validateFilename = file.name
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9_.-]/g, "");

  const filename = Date.now() + validateFilename;

  // eslint-disable-next-line
  const { data: uploadData, error } = await supabase.storage
    .from("images")
    .upload(filename, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: error.message });
  }

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(filename);

  const { data: metaData, error: metaError } = await supabase
    .from("image_metadata")
    .insert({
      filename: filename,
      uploaded_at: new Date().toISOString(),
      is_private: isPrivate,
    })
    .select();

  if (metaError) {
    console.error("Error saving metadata:", metaError);
    return NextResponse.json({ success: false, error: metaError.message });
  }

  const viewUrl = `/image/${metaData[0].id}`;

  return NextResponse.json({
    success: true,
    filename,
    publicUrl: publicUrlData.publicUrl,
    viewUrl,
  });
}
