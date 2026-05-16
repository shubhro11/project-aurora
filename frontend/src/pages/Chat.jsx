import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import { currentUserThunk } from "../store/reducers/authSlice.jsx";


import InputSection from "../components/ChatSection/InputSection";
import TitleSection from "../components/ChatSection/TitleSection";
import Sidebar from "../layouts/Sidebar.jsx";
import DeleteChatModal from "../components/SidebarSection/DeleteChatModal.jsx";
import { Plus } from "lucide-react";

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector((state) => state.chat.chats);
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const user = useSelector((state) => state.auth.user);


  const [deleteModal, setDeleteModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar");

    if (saved === null || saved === "undefined") return false;

    try {
      return JSON.parse(saved);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    dispatch(currentUserThunk());
  }, [dispatch]);


  return (
    <div className="min-h-screen w-full bg-[linear-gradient(343deg,#4a0e2a_0%,#2c0b3d_20%,#0b0a33_50%,#040407_85%)]">
      <div className="relative flex bg-transparent">
        <Sidebar
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          desktopCollapsed={desktopCollapsed}
          setDesktopCollapsed={setDesktopCollapsed}
          openDeleteModal={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
        />

        <section className="flex h-screen w-full flex-col bg-transparent transition-colors duration-200">
          <TitleSection
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
          />

          <div className="flex min-h-0 flex-1 flex-col">
            {activeChatId ? (
              <Outlet />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
                <h1 className="text-2xl font-medium text-(--color-on-tertiary-container) transition-colors duration-200">
                  Hi {user?.name?.firstName}
                </h1>
                <h1 className="text-center text-5xl font-medium text-(--color-on-tertiary-container) transition-colors duration-200">
                  Welcome to Aurora AI
                </h1>
                <p className="mt-2 max-w-md text-center  text-sm text-(--color-tertiary-fixed) transition-colors duration-200"> 
                  <span>Click on </span> 
                  +
                  <span> to create a New chat. Your chats stay in the sidebar, so you can pick
                  up where you left.</span> 
                  
                </p>
              </div>
            )}
          </div>

          {activeChatId && (
            <div className="mx-auto flex w-[90%] items-center justify-between bg-transparent px-1 transition-colors duration-200 md:w-180 md:px-0">
              <InputSection />
            </div>
          )}
          
        </section>
      </div>
      {openDeleteModal && <DeleteChatModal onClose={() => setOpenDeleteModal(false)}/>}
    </div>
  );
};

export default Chat;
