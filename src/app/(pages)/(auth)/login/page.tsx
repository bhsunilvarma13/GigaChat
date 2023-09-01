"use client";
import accountServices from "@/appwrite/Account";
import useAuth from "@/context/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function page() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setAuthStatus } = useAuth();

  const router = useRouter();

  const handleSubmission = (e: FormEvent) => {
    e.preventDefault();

    try {
      accountServices.login(formData).then(() => {
        setAuthStatus(true);

        router.push("/");
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="shadow-md p-5 rounded-md text-center bg-white">
        <h1 className="font-bold text-3xl">Login</h1>
        <p className="my-5 text-sm">
          Don't have an account?{" "}
          <Link className="underline font-medium" href="/register">
            Click here
          </Link>
        </p>
        <form onSubmit={handleSubmission} className="flex flex-col gap-2">
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            required
            className="outline-none p-2 w-96"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Password"
            required
            className="outline-none p-2 w-96"
          />
          <button
            type="submit"
            className="outline-none bg-green-500 rounded-md p-2 font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default page;
