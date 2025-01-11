import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Pagination } from "./Paginaton";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { ButtonRemove } from "@/shared/ButtonRemove";
import clsx from "clsx";
import dayjs from "dayjs";

const IMAGES_PER_PAGE = 12;

//TODO: BOTH OF THESE FUNCTIONS SHOULD BE REDESIGNED INTO ONE. !
async function getPublicImages(page: number) {
  const { data, error, count } = await supabase
    .from("image_metadata")
    .select("*", { count: "exact" })
    .eq("is_private", false)
    .order("uploaded_at", { ascending: false })
    .range((page - 1) * IMAGES_PER_PAGE, page * IMAGES_PER_PAGE - 1);

  const { data: allImages } = await supabase
    .from("image_metadata")
    .select("*", { count: "exact" })
    .eq("is_private", false)
    .order("uploaded_at", { ascending: false });

  if (error) {
    console.error("Error fetching images:", error);
    return { images: [], totalPages: 0, allImages: [] };
  }

  const totalPages = Math.ceil((count || 0) / IMAGES_PER_PAGE);

  return { images: data || [], totalPages, allImages };
}

//TODO: BOTH OF THESE FUNCTIONS SHOULD BE REDESIGNED INTO ONE. !
async function getAllImages(page: number) {
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
}

type TypePayload = { role?: string | JwtPayload } | void;

export async function ImageGallery({ page }: { page: number }) {
  const cookieStore = await cookies();
  const token = cookieStore?.get("admin")?.value;

  let payload: TypePayload = {};

  if (token?.length) {
    payload = jwt.verify(
      token,
      process.env.NEXT_JWT_SECRET_KEY!
    ) as TypePayload;
  }

  //TODO: BOTH OF THESE FUNCTIONS SHOULD BE REDESIGNED INTO ONE. !
  const { images, totalPages, allImages } =
    payload?.role === "admin"
      ? await getAllImages(page)
      : await getPublicImages(page);

  return (
    <>
      {images.length ? (
        <div>
          <h2 className="text-2xl font-semibold">
            Галерея изображений ({allImages?.length || 0} шт)
          </h2>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => {
                const { data } = supabase.storage
                  .from("images")
                  .getPublicUrl(image?.filename);

                return (
                  <Link
                    href={`/image/${image?.unique_id}`}
                    key={image?.unique_id || image?.id}
                    className="block"
                  >
                    <div className="relative aspect-square">
                      {payload?.role === "admin" && (
                        <div
                          className={clsx(
                            "flex w-full relative z-10 p-2 items-start",
                            image?.is_private
                              ? "justify-between"
                              : "justify-end"
                          )}
                        >
                          {image?.is_private && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium filter backdrop-blur-md bg-opacity-20">
                              Private
                            </span>
                          )}

                          <ButtonRemove image={image} />
                        </div>
                      )}

                      <Image
                        src={data?.publicUrl}
                        alt={image?.filename}
                        fill
                        className="object-cover rounded-lg"
                      />

                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg flex justify-between">
                        <span>
                          {dayjs(image?.created_at)
                            .locale("ru")
                            .format("DD.MM.YYYY")}
                        </span>

                        <span>
                          {dayjs(image?.created_at)
                            .locale("ru")
                            .format("HH:mm")}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </div>
      ) : (
        <div className=" w-full h-full flex items-center justify-center font-bold">
          Нет изображений
        </div>
      )}
    </>
  );
}
