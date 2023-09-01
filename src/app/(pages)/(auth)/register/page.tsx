"use client";
import accountServices from "@/appwrite/Account";
import databaseServices from "@/appwrite/Databases";
import useAuth from "@/context/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function Register() {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { setAuthStatus } = useAuth();

  const router = useRouter();

  const handleSubmission = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await accountServices
        .createUserAccount(formData)
        .then(async (userAccount) => {
          await accountServices
            .login({
              email: formData.email,
              password: formData.password,
            })
            .then(async () => {
              const now = new Date();

              await databaseServices
                .createDocument(
                  String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
                  String(
                    process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID
                  ),
                  String(userAccount?.$id),
                  {
                    name: formData.name,
                    email: formData.email,
                    lastSeen: String(now),
                  }
                )
                .then(() => {
                  setAuthStatus(true);

                  router.push("/");
                });
            });
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="shadow-md p-5 rounded-md text-center bg-white">
        <h1 className="font-bold text-3xl">Register</h1>
        <p className="my-5 text-sm">
          Already have an account?{" "}
          <Link className="underline font-medium" href="/login">
            Click here
          </Link>
        </p>
        <form onSubmit={handleSubmission} className="flex flex-col gap-2">
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormdata((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Name"
            required
            className="outline-none p-2 w-96"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormdata((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            required
            className="outline-none p-2 w-96"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormdata((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Password"
            required
            className="outline-none p-2 w-96"
          />
          <button
            type="submit"
            className="outline-none bg-green-500 rounded-md p-2 font-medium"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
