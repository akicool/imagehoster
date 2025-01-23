import { ImageUploader } from "../components/Image/Uploader";
import { ImageGallery } from "../components/Image/Gallery";
import { Rubik } from "next/font/google";
import clsx from "clsx";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export default async function Home({ searchParams }: Props) {
  const { page = "1" } = await searchParams;

  return (
    <main className="container mx-auto py-8 px-4 h-dvh flex flex-col justify-between text-black">
      <h1 className={clsx("text-3xl mb-4", rubik.variable)}>Image Hoster</h1>

      <div className="mb-4 bg-white p-5 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Загрузить изображение</h2>
        <ImageUploader />
      </div>

      <hr className="my-4 border-black" />

      <ImageGallery page={Number(page)} />
    </main>
  );
}
