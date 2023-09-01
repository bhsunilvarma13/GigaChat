"use client";
import accountServices from "@/appwrite/Account";
import databaseServices from "@/appwrite/Databases";
import { Query, client } from "@/appwrite/config";
import { Models } from "node-appwrite";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SidebarContact from "./SidebarContact";

function Sidebar({
  sidebarOpen,
  setBoxes,
}: {
  sidebarOpen: boolean;
  setBoxes: Dispatch<
    SetStateAction<{
      [key: string]: {
        top: number;
        left: number;
      };
    }>
  >;
}) {
  const [chatPairs, setChatPairs] = useState<Models.Document[] | undefined>();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>();

  const getChats = () => {
    try {
      databaseServices
        .listDocuments(
          String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_PAIRS_COLLECTION_ID),
          []
        )
        .then((res) => {
          setChatPairs(res?.documents);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    accountServices.getCurrentUser().then((res) => {
      setUser(res);
      getChats();
    });

    const unsubscribe = client.subscribe(
      `databases.${String(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID
      )}.collections.${String(
        process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_PAIRS_COLLECTION_ID
      )}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setChatPairs((prev: Models.Document[] | undefined) => [
            response.payload,
            // @ts-ignore
            ...prev,
          ]);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className={`absolute h-full bg-white top-0 z-10 ${
        sidebarOpen ? "left-0" : "left-[-50%]"
      } transition-all ease-in-out shadow-md border`}
    >
      <div className="mt-16 p-2">
        <h1 className="font-medium">Your Chats</h1>
        {chatPairs
          // @ts-ignore
          ?.filter((chatPair) => chatPair.accounts.includes(user?.$id))
          ?.map((chatPair) => (
            <div
              onClick={() =>
                setBoxes((prev) => ({
                  ...prev,
                  [chatPair.$id]: { top: 150, left: 550 },
                }))
              }
              key={chatPair.$id}
            >
              <SidebarContact
                chatPair={chatPair}
                // @ts-ignore
                user={user}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Sidebar;
