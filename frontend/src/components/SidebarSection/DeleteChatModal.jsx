import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatThunk, fetchChats } from "../../store/reducers/chatSlice";
import { toast } from "react-toastify";
import { TriangleAlert, X } from "lucide-react";

import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";
import { useNavigate, useParams } from "react-router-dom";

const DeleteChatModal = ({ onClose }) => {
    const { id: urlChatId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.chat);
  const selectedChatId = useSelector((state) => state.chatModal.chatId);

  const deleteModalRef = useRef();

  const closeDeleteModal = (e) => {
    deleteModalRef.current === e.target ? onClose() : "";
  };

  async function deleteChatHandler() {
    try {
      await dispatch(deleteChatThunk(selectedChatId))
        .unwrap()
        .then(() => {
          // Only fetch AFTER the delete is confirmed successful
          dispatch(fetchChats());
        });
        
        if (selectedChatId === urlChatId) {
          navigate('/chat'); // or navigate('/chat') depending on your base route
        }
      toast.error("Chat Deleted Successfully");
      onClose();
      reset();
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div
      ref={deleteModalRef}
      onClick={closeDeleteModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs"
    >
      {/* Delete Modal */}
      <div className="relative border border-(--color-surface-container-high) flex w-[90%] xs:w-85 flex-col items-center gap-4 rounded-lg bg-(--color-surface-container-low) p-6 pt-8">

        <span onClick={onClose}
         className="absolute top-4 right-4 cursor-pointer pt-0.5 leading-none text-(--color-tertiary-fixed) transition-all duration-200">
          <X size={18} />
        </span>

        <span className="text-red-500">
          <TriangleAlert size={44} />
        </span>

        <h1 className="text-center font-(family-name:--font-body) text-white">
          Are you sure you'd like to delete this chat? This cannot be undone.
        </h1>

        <div className="flex w-full gap-2 font-(family-name:--font-body)">
          <button
          onClick={onClose}
           className="w-full cursor-pointer rounded bg-(--color-primary-container) px-3 py-1.5 text-sm text-(--color-on-primary-container) transition-colors duration-200 hover:bg-(--color-secondary-container) hover:text-(--color-on-secondary-container)">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={deleteChatHandler}
            className={`${loading ? "cursor-not-allowed bg-[#6f6e81] text-[#c3c5ca]" : "text-red-400 font-(family-name:--font-body) hover:bg-(--color-error) hover:text-(--color-on-error) cursor-pointer"} w-full rounded text-sm transition-colors duration-200`}
          >
            {loading
              ? "Deleting chat" : "Yes, delete it"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
