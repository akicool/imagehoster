"use client";
import React from "react";
import { ToastContainer } from "react-toastify";

export const Toaster = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      //   transition={Bounce}
    />
  );
};
