import accountServices from "@/appwrite/Account";
import databaseServices from "@/appwrite/Databases";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";

function Message({ chat }: { chat: Models.Document }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>();
  const [account, setAccount] = useState<Models.Document | undefined>();

  const time = new Date(chat.timestamp).toLocaleString();

  const getUser = () => {
    try {
      accountServices.getCurrentUser().then((res) => {
        setUser(res);
        databaseServices
          .getDocument(
            String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
            String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID),
            String(chat.account)
          )
          .then((res) => setAccount(res));
      });
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div
      className={`w-full flex ${
        account?.$id === user?.$id ? "justify-end" : "justify-start"
      } my-1`}
    >
      <div
        className={`relative ${
          account?.$id === user?.$id ? "bg-green-400" : "bg-white"
        } w-1/2 p-1 rounded-md`}
      >
        <div className="border-b border-white/20">
          <h1 className="text-[10px] font-medium">{account?.name}</h1>
        </div>
        <h2 className="text-sm">{chat.message}</h2>
        <p className=" text-right mt-1 text-[8px] text-black/75">{time}</p>
      </div>
    </div>
  );
}

export default Message;
