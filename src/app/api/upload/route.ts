import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const files = Array.from(data.getAll("files")) as File[];
  const isPrivate = data.get("isPrivate") === "true";

  if (!files || !files.length) {
    return NextResponse.json({ success: false, error: "Вы не выбрали файл" });
  }

  if (files.some((file) => file.size > 5 * 1024 * 1024)) {
    return NextResponse.json({
      success: false,
      error: "Размер файла не должен превышать 5MB",
    });
  }

  const promises = files.map(async (file) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // const validateFilename = file.name
    //   .replace(/ /g, "-")
    //   .replace(/[^a-zA-Z0-9_.-]/g, "");

    const validateFilename =
      file.name.trim() === ""
        ? `empty-name${randomUUID().slice(0, 6)}`
        : file.name.replace(/\s/g, "_");

    const filename = validateFilename;

    // eslint-disable-next-line
    const { data: uploadData, error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Ошибка загрузки файла:", error);
      return { success: false, error: error.message };
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
        unique_id: randomUUID(),
      })
      .select();

    if (metaError) {
      console.error("Ошибка создания метаданных:", metaError);
      return { success: false, error: metaError.message };
    }

    //   const viewUrl = `/image/${metaData[0].id}`;
    const viewUrl = `/image/${metaData[0].unique_id}`;

    return {
      success: true,
      filename,
      publicUrl: publicUrlData.publicUrl,
      viewUrl,
    };
  });

  const results = await Promise.all(promises);

  return NextResponse.json({
    success: true,
    results,
  });
}
