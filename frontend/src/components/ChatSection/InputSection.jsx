import { ArrowUp, CornerDownLeft, LineStyle } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../sockets/socket.js";

import { createChatThunk } from "../../store/reducers/chatSlice";
import { addUserMessage } from "../../store/reducers/messageSlice.jsx";
import { useNavigate } from "react-router-dom";

const InputSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatSelector = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);

  const textareaRef = useRef(null);
  const [inputText, setInputText] = useState(""); // for input field

  async function handleUserMessage() {
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;
    let currentChatId = activeChatId;

    // Create chat if none exists
    if (!currentChatId) {
      try {
        const newChat = await dispatch(createChatThunk()).unwrap();

        currentChatId = newChat._id;
        navigate(`/chat/${activeChatId}`)
      } catch (error) {
        console.log(error);
        return;
      }
    }

    // Send through socket
    socket.emit("message", {
      chat: currentChatId,
      content: trimmedInput,
    });

    // Instant UI update
    dispatch(addUserMessage(trimmedInput));

    setInputText("");
  }


  const handleInput = () => {
    const el = textareaRef.current;
    el.style.height = "auto"; // reset height
    el.style.height = el.scrollHeight + "px"; // grow based on content
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-(--color-surface-container-lowest)">
      <div className="flex w-full flex-col rounded-4xl border border-(--color-surface-container-high) bg-(--color-surface-container) p-2 transition-colors duration-200">
        {/* Input row */}

        <div className="flex w-full items-end gap-2">
          <div className="flex w-full flex-col gap-1">
            <textarea
              name="chatInput"
              value={inputText}
              ref={textareaRef}
              rows={1}
              onInput={handleInput}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (inputText.trim()) {
                    handleUserMessage();
                    handleInput();
                  }
                }
              }}
              placeholder="Ask anything"
              className="scrollbar-custom max-h-32 w-full resize-none overflow-y-auto px-2.5 py-2 transition-[height] duration-100 ease-in-out outline-none placeholder:text-[#545B71] text-[#E2E7FF] dark:placeholder:text-[#A3AAC4]"
            />


            {/* inputText */}
            <p
              className={` ${inputText.length > 0 ? "block" : "hidden"} flex justify-center gap-1 p-1 px-3 text-center text-xs leading-none text-(--color-on-tertiary-container) transition-colors duration-200`}
            >
              Press Enter{" "}
              <span>
                <CornerDownLeft size={14} />
              </span>{" "}
              to send • Shift + Enter for a new line{" "}
              <span>
                <LineStyle size={14} />
              </span>
            </p>
          </div>

          <button
            onClick={() => handleUserMessage()}
            className={`group rounded-4xl p-2 transition-colors duration-200 ${
              inputText.length > 0
                ? "bg-(--color-primary-container) text-(--color-on-primary-container) hover:bg-(--color-secondary-container) hover:text-(--color-on-secondary-container)"
                : "pointer-events-none bg-gray-500"
            }`}
          >
            <ArrowUp
              className="text-gray-100 transition-colors duration-200 group-hover:text-gray-300 group-active:text-gray-400"
              size={24}
            />
          </button>
        </div>
      </div>

      {/* Footer note */}
      <h1 className="px-10 py-2 text-center text-xs text-(--color-on-tertiary-container) transition-colors duration-200">
        Aurora can make mistakes. Check important info. See Cookie Preferences.
      </h1>
    </div>
  );
};

export default InputSection;
