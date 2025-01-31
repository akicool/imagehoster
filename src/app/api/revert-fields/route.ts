// eslint-disable-next-line
import { supabase } from "@/lib/supabase";
// eslint-disable-next-line
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // const { data, error } = await supabase
  //   .from("image_metadata")
  //   .select("id, is_public");

  // for (const item of data!) {
  //   const { error: updateError } = await supabase
  //     .from("image_metadata")
  //     .update({ is_public: !item.is_public })
  //     .eq("id", item.id);

  //   if (updateError) {
  //     console.error("Error reverting image fields:", updateError);
  //     return NextResponse.json({ success: false, error: updateError.message });
  //   }
  // }

  // if (error) {
  //   console.error("Error reverting image fields:", error);
  //   return NextResponse.json({ success: false, error: error.message });
  // }

  // return NextResponse.json({ success: true, data });

  return NextResponse.json({ success: true });
}
