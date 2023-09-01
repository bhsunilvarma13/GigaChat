import update from "immutability-helper";
import type { CSSProperties, FC, FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import type { XYCoord } from "react-dnd";
import { useDrop } from "react-dnd";
import { Box } from "./Box";
import Avatar from "./Avatar";
import accountServices from "@/appwrite/Account";
import databaseServices from "@/appwrite/Databases";
import { ID, Models } from "appwrite";
import NewChat from "./NewChat";
import Sidebar from "./Sidebar";

const styles: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};

export interface ContainerProps {
  hideSourceOnDrag: boolean;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number } };
}

export const Container: FC<ContainerProps> = ({ hideSourceOnDrag }) => {
  const [name, setName] = useState(".");
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeBox, setActiveBox] = useState<string>("");
  const [message, setMessage] = useState("");

  const [boxes, setBoxes] = useState<{
    [key: string]: {
      top: number;
      left: number;
    };
  }>({});

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      const updatedBoxes = update(boxes, {
        [id]: {
          $merge: { left, top },
        },
      });
      setBoxes(updatedBoxes);
    },
    [boxes, setBoxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "box",
      drop(
        item: { type: string; id: string; top: number; left: number },
        monitor
      ) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  const getName = () => {
    try {
      accountServices
        .getCurrentUser()
        .then((res: Models.User<Models.Preferences> | null) => {
          setUser(res);
          try {
            databaseServices
              .getDocument(
                String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
                String(process.env.NEXT_PUBLIC_APPWRITE_ACCOUNTS_COLLECTION_ID),
                String(res?.$id)
              )
              .then((res: Models.Document | undefined) => {
                setName(res?.name);
              });
          } catch (error: any) {
            alert(error.message);
          }
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  const MoveBoxOnTop = (id: string) => {
    if (!boxes[id]) {
      return boxes; // If the selectedKey doesn't exist in obj, just return the original obj
    }

    setBoxes({
      ...Object.fromEntries(
        Object.entries(boxes).filter(([key]) => key !== id)
      ),
      [id]: boxes[id],
    });
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (activeBox) {
      try {
        const now = new Date();
        databaseServices
          .createDocument(
            String(process.env.NEXT_PUBLIC_APPWRITE_DB_ID),
            String(process.env.NEXT_PUBLIC_APPWRITE_CHATS_COLLECTION_ID),
            ID.unique(),
            {
              message: String(message),
              account: String(user?.$id),
              timestamp: String(now),
              seen: false,
              chatId: String(activeBox),
            }
          )
          .then(() => setMessage(""));
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert("Please select a chatbox.");
    }
  };

  return (
    <div ref={drop} style={styles}>
      <div className="flex items-center px-4">
        <div
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white z-20 p-2 rounded-md shadow-md border cursor-pointer"
        >
          {sidebarOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
          )}
        </div>

        <div className="w-full h-[8vh] flex items-center justify-end gap-4">
          <NewChat setBoxes={setBoxes} userr={user} />
          <Avatar name={name} />
        </div>
      </div>

      {Object.keys(boxes).map((key) => {
        const { left, top } = boxes[key] as {
          top: number;
          left: number;
          title: string;
        };
        return (
          <div
            onClick={() => {
              setActiveBox(key);
              MoveBoxOnTop(key);
            }}
            onDragStart={() => {
              setActiveBox(key);
              MoveBoxOnTop(key);
            }}
            key={key}
          >
            <Box
              boxes={boxes}
              setBoxes={setBoxes}
              user={user}
              activeBox={activeBox}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
            />
          </div>
        );
      })}

      <Sidebar setBoxes={setBoxes} sidebarOpen={sidebarOpen} />

      <div className="absolute bottom-5 left-[50%] -translate-x-[50%]">
        <p className="text-center text-sm my-2 text-gray-500">
          Click on a box and send your message
        </p>
        <form
          onSubmit={handleSendMessage}
          className="flex items-center justify-between bg-white rounded-md shadow-md border p-2 w-[800px]"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 outline-none"
            placeholder="Type your message..."
          />
          <button type="submit">
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
