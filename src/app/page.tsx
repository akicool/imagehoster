import { ImageUploader } from "../components/Image/Uploader";
import { ImageGallery } from "../components/Image/Gallery";
import Link from "next/link";
import { Logo } from "@/shared/Logo";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page = "1" } = await searchParams;

  return (
    <main className="container mx-auto py-8 px-4 h-dvh flex flex-col justify-between text-black">
      <div className="flex items-center w-full justify-between mb-4">
        <Logo />

        <Link
          href={"/generator"}
          className="px-4 py-2 rounded-md bg-blue-500 font-semibold hover:bg-blue-600 transition duration-300 ease-in-out text-white"
        >
          Image AI
        </Link>
      </div>

      <div className="mb-4 bg-white p-5 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Загрузить изображение</h2>
        <ImageUploader />
      </div>

      <hr className="my-4 border-black" />

      <ImageGallery page={Number(page)} />
    </main>
  );
}
