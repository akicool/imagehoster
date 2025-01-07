"use client";
import React, { FormEvent, useState } from "react";

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const response = await fetch("/api/admin", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log({ data });

  if (response.ok) {
    window.location.href = "/admin";
  } else {
    alert(data.error);
  }
};

export const Form = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col" htmlFor="login">
        Login
        <input
          className="border border-gray-500 rounded px-2 py-1"
          type="text"
          id="login"
          name="login"
        />
      </label>

      <label className="flex flex-col" htmlFor="password">
        Password
        <div className="relative">
          <input
            className="border border-gray-500 rounded px-2 py-1 pr-10 w-full"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
          />

          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </label>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        type="submit"
      >
        Log in
      </button>
    </form>
  );
};
