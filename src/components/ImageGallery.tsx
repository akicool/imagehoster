import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Pagination } from "./Paginaton";

const IMAGES_PER_PAGE = 12;

async function getImages(page: number) {
  const { data, error, count } = await supabase
    .from("image_metadata")
    .select("*", { count: "exact" })
    .eq("is_private", false)
    .order("uploaded_at", { ascending: false })
    .range((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching images:", error);
    return { images: [], totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / IMAGES_PER_PAGE);

  return { images: data || [], totalPages };
}

export async function ImageGallery({ page }: { page: number }) {
  const { images, totalPages } = await getImages(page);

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => {
          const { data } = supabase.storage
            .from("images")
            .getPublicUrl(image.filename);

          return (
            <Link href={`/image/${image.id}`} key={image.id} className="block">
              <div className="relative aspect-square">
                <Image
                  src={data.publicUrl}
                  alt={image.filename}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
