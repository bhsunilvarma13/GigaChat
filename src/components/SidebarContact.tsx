"use client";
import databaseServices from "@/appwrite/Databases";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

function SidebarContact({
  chatPair,
  user,
}: {
  chatPair: Models.Document;
  user: Models.User<Models.Preferences> | null;
}) {
  const [userDetails, setUserDetails] = useState<any>();

  const accounts = chatPair.accounts;

  const otherUser = accounts.filter((userId: string) => userId != user?.$id);

  useEffect(() => {
    databaseServices
      .getDocument(
        String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
        String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID),
        otherUser[0]
      )
      .then((res: any) => setUserDetails(res));
  }, []);

  return (
    <div className="flex my-2 items-center gap-2 bg-white hover:bg-gray-100 rounded-md p-2 pr-16  cursor-pointer">
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
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium">{userDetails?.name}</p>
        <p className="text-xs">{userDetails?.email}</p>
      </div>
    </div>
  );
}

export default SidebarContact;
