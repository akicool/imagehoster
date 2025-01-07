import { Rubik } from "next/font/google";
import clsx from "clsx";
import { Form } from "./Form";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export default async function AdminPage() {
  return (
    <main className="container mx-auto py-8 px-4 h-dvh flex w-full flex-col items-center text-black">
      <h1 className={clsx("text-3xl mb-4", rubik.variable)}>Admin</h1>

      <Form />
    </main>
  );
}
