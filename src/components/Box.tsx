import {
  useEffect,
  type CSSProperties,
  type FC,
  type ReactNode,
  useState,
} from "react";
import { useDrag } from "react-dnd";
import Message from "./Message";
import databaseServices from "@/appwrite/Databases";
import { Models } from "appwrite";
import ChatComponent from "./ChatComponent";
import ChatBox from "./ChatBox";

const style: CSSProperties = {
  position: "absolute",
};

export interface BoxProps {
  id: any;
  left: number;
  top: number;
  hideSourceOnDrag?: boolean;
  activeBox: string;
  user: Models.User<Models.Preferences> | null | undefined;
  boxes: any;
  setBoxes: any;
}

export const Box: FC<BoxProps> = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  activeBox,
  user,
  boxes,
  setBoxes,
}) => {
  const [chatPair, setChatPair] = useState<Models.Document | undefined>();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "box",
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  );

  useEffect(() => {
    getChatPair();
  }, []);

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />;
  }

  const getChatPair = () => {
    try {
      databaseServices
        .getDocument(
          String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
          String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_PAIRS_COLLECTION_ID),
          String(id)
        )
        .then((res) => setChatPair(res));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const accounts = chatPair?.accounts;

  const otherUser = accounts?.filter((userId: string) => userId != user?.$id);

  return (
    <div
      className={`w-96 h-96 bg-white rounded-md shadow-md border border-green-500`}
      style={{ ...style, left, top }}
      data-testid="box"
    >
      <div
        className={`flex items-center gap-2 border-b rounded-t-md p-2 ${
          activeBox === id && "bg-green-400"
        }`}
        ref={drag}
      >
        <ChatComponent otherUser={otherUser} />
      </div>
      <ChatBox chatPairId={String(chatPair?.$id)} />
    </div>
  );
};
