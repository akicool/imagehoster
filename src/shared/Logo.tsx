"use client";
import Image from "next/image";
import Link from "next/link";
import { Rubik } from "next/font/google";
import clsx from "clsx";

import favicon from "../app/favicon.ico";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 group lg:hover:text-blue-500 transition lg:duration-300 duration-200 ease-in-out active:text-blue-500"
    >
      <Image
        src={favicon}
        alt="logo"
        width={30}
        height={30}
        className="rounded-lg lg:group-hover:rotate-12 transition lg:duration-300 duration-200 ease-in-out group-active:rotate-12"
      />

      <h1 className={clsx("text-2xl", rubik.variable)}>Image Hoster</h1>
    </Link>
  );
};
