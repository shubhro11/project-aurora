import { lazy, Suspense } from "react";
import { useEffect, useRef } from "react";
import { socket } from "../../sockets/socket.js";
const Message = lazy(() => import("../Message"));

import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../../store/reducers/chatSlice.jsx";
import {
  addAIMessage,
  fetchMessagesThunk,
} from "../../store/reducers/messageSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const viewChats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const allMessage = useSelector((state) => state.message.messages);
  const loading = useSelector((state) => state.message.loading);

  const user = useSelector((state) => state.auth.user);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeChatId) {
      dispatch(fetchMessagesThunk(activeChatId));
    }
  }, [activeChatId, dispatch]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleAIResponse = async (message) => {
      dispatch(addAIMessage(message.content));
    };

    const handleTitleUpdate = (data) => {
      dispatch(fetchChats());
    };

    socket.on("ai-response", handleAIResponse);
    socket.on("chat-title-updated", handleTitleUpdate);

    return () => {
      socket.off("ai-response", handleAIResponse);
      socket.off("chat-title-updated", handleTitleUpdate);
    };
  }, [dispatch, activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [allMessage]);


  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {allMessage.length > 0 ? (
        <div className="scrollbar-custom w-full overflow-auto pl-1.5">
          <div className="mx-auto flex min-h-0 w-[90%] flex-col gap-6 overflow-y-auto py-4 md:w-180">
            <>
              {allMessage.map((message) => (
              <div key={message._id}>
                <Message message={message} />
              </div>
            ))}

            {loading && (
              <div className="flex gap-5">
            <Quantum
                size="40"
                speed="1.3"
                color="var(--color-tertiary-fixed-dim)"
              />

              <div className="flex flex-col gap-1 opacity-40">
                <h1 className="w-100 h-4 bg-gray-300 animate-pulse rounded-md"></h1>
                 <p className="w-70 h-2 bg-gray-300 animate-pulse rounded-md"></p>
                 <p className="w-65 h-2 bg-gray-300 animate-pulse rounded-md"></p>
              </div>
            </div>
            )}
            {/* 👇 important */}
            <div ref={bottomRef} />
            </>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
          <h1 className="text-2xl font-medium text-(--color-on-tertiary-container) transition-colors duration-200">
            Hi {user?.name?.firstName}
          </h1>
          <h1 className="text-center text-5xl font-medium text-(--color-on-tertiary-container) transition-colors duration-200">
            What's on your mind today
          </h1>
          <p className="mt-2  max-w-md text-center text-sm text-(--color-tertiary-fixed) transition-colors duration-200">
            Ask anything. Paste text, brainstorm ideas, or get quick
            explanations.
          </p>
        </div>
      )}
      
    </div>
  );
};

export default ChatArea;
