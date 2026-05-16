import {
  ChevronRight,
  EllipsisVertical,
  Pencil,
  PencilLine,
  Pin,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteChatThunk,
  fetchChats,
  setActiveChat,
} from "../../store/reducers/chatSlice";
import { fetchMessagesThunk } from "../../store/reducers/messageSlice";
import { setChatId } from "../../store/reducers/chatModalSlice";

const RecentChats = ({ mobileSidebarOpen, setMobileSidebarOpen, openDeleteModal,
  setOpenDeleteModal, }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viewChats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);

  const menuRef = useRef(null);
  const [showRecents, setShowRecents] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  

  /* Fetching Previous Chats */
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);


  useEffect(() => {
    function handleClickOutside(e) {
      // If the click is NOT on the ellipsis button and NOT inside the menu
      if (!e.target.closest(".menu-container") && openMenuId !== null) setOpenMenuId(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);



  function clickedActiveChat(chat) {
    dispatch(setActiveChat(chat._id));
    dispatch(fetchMessagesThunk(chat._id));
  }

  function handleButtonClick(chat) {
    navigate(`/chat/${chat._id}`);
    clickedActiveChat(chat); // ✅ important
    setMobileSidebarOpen(true);
  }

  function toggleMenu(chatId) {
    setOpenMenuId((prev) => (prev === chatId ? null : chatId));
  }

  
  // Selected Chat Actions: Delete
  const handleAction = (e, callback, id) => {
    e.stopPropagation();
    callback(id);
  };
  function handleDelete(chatId) {
    setOpenDeleteModal(true)
    dispatch(setChatId(chatId))
    setOpenMenuId(null);
  }
  
  

  return (
    <div className="mt-6 flex flex-1 flex-col gap-2 overflow-x-hidden">
      {viewChats.length > 0 ? (
        <>
          <div
            onClick={() => setShowRecents(!showRecents)}
            className="flex items-center cursor-pointer"
          >
            <p className="p-1 text-(--color-tertiary-fixed)">Recent chats</p>
            <span
              className={`pt-0.5 leading-none text-(--color-tertiary-fixed) transition-all duration-200 ${showRecents ? "rotate-90" : "rotate-0"}`}
            >
              <ChevronRight size={14} />
            </span>
          </div>

          <div
            className={`scrollbar-custom flex flex-col h-130 gap-1 overflow-y-auto transition-all duration-200 ${showRecents ? "max-h-135" : "max-h-0 opacity-0"}`}
          >
            <ul className="flex flex-col gap-1">
              {viewChats.map((c) => {
                return (
                  <li
                    key={c._id}
                    onClick={() => handleButtonClick(c)}
                    className={`relative flex border border-(--color-surface-container-high) cursor-pointer items-center justify-between rounded p-3 text-sm transition-colors duration-200 ${
                      String(c._id) === String(activeChatId)
                        ? "bg-(--color-surface-container-highest) text-(--color-tertiary-fixed)" // active state
                        : "bg-transparent text-(--color-on-surface) hover:bg-(--color-surface-container-high)"
                    } `}
                  >
                    <span className="overflow-hidden">
                      {c.title.length > 24
                        ? `${c.title.slice(0, 24)}...`
                        : `${c.title}`}
                    </span>

                    <div
                      ref={menuRef}
                      className="relative items-center gap-2 rounded-4xl px-0.5 py-1 hover:bg-(--color-surface-container-high) transition-colors duration-200"
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation(); // Stop navigation when clicking the dots
                          toggleMenu(c._id);
                        }}
                        className="text-(--color-on-surface) transition-colors duration-200"
                      >
                        <EllipsisVertical size={20} />
                      </span>
                    </div>

                    {openMenuId === c._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="menu-container border border-(--color-surface-container-high) absolute top-11 right-3 z-50 w-32 flex justify-center rounded bg-zinc-900 shadow-xl"
                      >
                        

                        
                        <button
                          onClick={(e) => handleAction(e, handleDelete, c._id)}
                          className="flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <p className="p-1 text-(--color-on-tertiary-container)">No chats yet</p>
      )}
    </div>
  );
};

export default RecentChats;
