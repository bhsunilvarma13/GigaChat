import databaseServices from "@/appwrite/Databases";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

function ChatComponent({ otherUser }: { otherUser: string }) {
  const [user, setUser] = useState<Models.Document | undefined>();

  const lastSeen = new Date(user?.lastSeen).toLocaleString();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    if (otherUser) {
      try {
        databaseServices
          .getDocument(
            String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
            String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID),
            String(otherUser[0])
          )
          .then((res) => setUser(res));
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h1 className="text-sm font-medium">{user?.name}</h1>
        <p className="text-xs">Last seen: {lastSeen}</p>
      </div>
    </>
  );
}

export default ChatComponent;
