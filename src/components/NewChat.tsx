"use client";
import databaseServices from "@/appwrite/Databases";
import { ID, Models } from "appwrite";
import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

function NewChat({
  userr,
  setBoxes,
}: {
  userr: Models.User<Models.Preferences> | null | undefined;
  setBoxes: Dispatch<
    SetStateAction<{
      [key: string]: {
        top: number;
        left: number;
      };
    }>
  >;
}) {
  const [inputText, setInputText] = useState<string>("");
  const [data, setData] = useState<Models.Document[] | undefined>();
  const [newChat, setNewChat] = useState<string>();

  const getUsers = () => {
    try {
      databaseServices
        .listDocuments(
          String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID),
          []
        )
        .then((res) => setData(res?.documents));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const result = inputText
    ? data?.filter(
        (doc) => doc.name.includes(inputText) || doc.email.includes(inputText)
      )
    : [];

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      databaseServices
        .createDocument(
          String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_PAIRS_COLLECTION_ID),
          ID.unique(),
          { accounts: [newChat, userr?.$id] }
        )
        .then((res: any) => {
          setNewChat("");
          setInputText("");
          setBoxes((prev) => ({
            ...prev,
            [res.$id]: { top: 150, left: 550 },
          }));
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white shadow-md rounded-md border px-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            className="outline-none p-2 text-sm"
            placeholder="Start a new chat..."
          />
          <button type="submit" />

          {inputText && (
            <div className="absolute top-12 bg-white rounded-md shadow-md border w-64 mt-2">
              {result?.map((user) => (
                <div
                  key={user.$id}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 rounded-md p-2 cursor-pointer"
                >
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
                    <p className="text-xs font-medium">{user.name}</p>
                    <p className="text-xs">{user.email}</p>
                  </div>
                  <button
                    type="submit"
                    onClick={() => setNewChat(user.$id)}
                    className="hover:bg-green-500 hover:text-white rounded-full"
                  >
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewChat;
