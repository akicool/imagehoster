import { IMAGES_PER_PAGE } from "@/constants";
import { supabase } from "@/lib/supabase";

export const getAllImages = async (page: number) => {
  const { data, error, count } = await supabase
    .from("image_metadata")
    .select("*", { count: "exact" })
    .order("uploaded_at", { ascending: false })
    .range((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE - 1);

  const { data: allImages } = await supabase
    .from("image_metadata")
    .select("*", { count: "exact" })
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching images:", error);
    return { images: [], totalPages: 0, allImages: [] };
  }

  const totalPages = Math.ceil((count || 0) / IMAGES_PER_PAGE);

  return { images: data || [], totalPages, allImages };
};
