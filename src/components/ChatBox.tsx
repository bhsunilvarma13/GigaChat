import React, { useEffect, useState } from "react";
import Message from "./Message";
import databaseServices from "@/appwrite/Databases";
import { Query } from "appwrite";
import { Models } from "node-appwrite";
import { client } from "@/appwrite/config";

function ChatBox({ chatPairId }: { chatPairId: string }) {
  const [messages, setMessages] = useState<any>();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${String(
        process.env.NEXT_PUBLIC_APPWRITE_DB_ID
      )}.collections.${String(
        process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID
      )}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log(response.payload);

          const message: any = response.payload;
          if (message.chatId === chatPairId) {
            console.log(response.payload);

            setMessages((prev: any) => [
              // @ts-ignore
              ...prev,
              response.payload,
            ]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = () => {
    try {
      databaseServices
        .listDocuments(
          String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID),
          [Query.equal("chatId", [String(chatPairId)])]
        )
        .then((res) => setMessages(res));
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-2 h-[335px] rounded-md flex flex-col justify-end overflow-y-scroll">
      {messages?.documents.map((message: any) => (
        <Message key={message.$id} chat={message} />
      ))}
    </div>
  );
}

export default ChatBox;
