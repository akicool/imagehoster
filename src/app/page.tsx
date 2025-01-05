import { ImageUploader } from "../components/ImageUploader";
import { ImageGallery } from "../components/ImageGallery";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const { page = "1" } = await searchParams;

  return (
    <main className="container mx-auto py-8 px-4 h-dvh flex flex-col justify-between">
      <h1 className="text-3xl font-bold mb-4">Image Hoster</h1>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Загрузить изображение</h2>
        <ImageUploader />
      </div>

      <ImageGallery page={Number(page)} />
    </main>
  );
}
