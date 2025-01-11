import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-4">
      <h2 className="text-[5vw] font-bold">Ошибка 404</h2>
      <h2 className="text-[5vw] font-bold">такой страницы не существует</h2>
      <p className="text-2xl">:(</p>
      <Link href="/">
        <p className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md">
          Вернуться на главную
        </p>
      </Link>
    </div>
  );
}
