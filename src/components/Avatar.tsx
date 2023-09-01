"use client";
import accountServices from "@/appwrite/Account";
import useAuth from "@/context/useAuth";
import { useRouter } from "next/navigation";
import React from "react";

function Avatar({ name }: { name: string }) {
  const router = useRouter();

  const { setAuthStatus } = useAuth();

  const getInitials = (name: string) => {
    const nameArray = name.split(" ");
    const result =
      nameArray.length >= 2
        ? `${nameArray[0][0]}${nameArray[1][0]}`
        : `${nameArray[0][0]}`;

    return result;
  };

  const handleClick = () => {
    try {
      accountServices.logout().then(() => {
        setAuthStatus(false);
        router.push("/login");
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-green-500 cursor-pointer flex items-center justify-between font-medium rounded-md p-2 gap-2"
    >
      {getInitials(name)}
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
      </div>
    </div>
  );
}

export default Avatar;
