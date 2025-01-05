import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const secretKey = request.nextUrl.searchParams.get("secret");
  if (secretKey !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const threeOldDays = new Date();
  threeOldDays.setDate(threeOldDays.getDate() - 3);

  const { data: oldImages, error: fetchError } = await supabase
    .from("image_metadata")
    .select("filename")
    .lt("uploaded_at", threeOldDays.toISOString());

  if (fetchError) {
    console.error("Error fetching old images:", fetchError);
    return NextResponse.json({ success: false, error: fetchError.message });
  }

  if (!oldImages || oldImages.length === 0) {
    return NextResponse.json({
      success: true,
      message: "No old images to delete",
    });
  }

  const filesToDelete = oldImages.map((img) => img.filename);
  // eslint-disable-next-line
  const { data: deleteData, error: deleteError } = await supabase.storage
    .from("images")
    .remove(filesToDelete);

  if (deleteError) {
    console.error("Error deleting old images:", deleteError);
    return NextResponse.json({ success: false, error: deleteError.message });
  }

  const { error: metaDeleteError } = await supabase
    .from("image_metadata")
    .delete()
    .in("filename", filesToDelete);

  if (metaDeleteError) {
    console.error("Error deleting metadata:", metaDeleteError);
  }

  return NextResponse.json({
    success: true,
    message: `Deleted ${filesToDelete.length} old images`,
  });
}
