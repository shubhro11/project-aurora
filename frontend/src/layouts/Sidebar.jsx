import { Plus, TextAlignJustify, X } from "lucide-react";
import { lazy, useEffect } from "react";
const RecentChats = lazy(
  () => import("../components/SidebarSection/RecentChats"),
);

import { useDispatch, useSelector } from "react-redux";
import { createChatThunk } from "../store/reducers/chatSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  desktopCollapsed,
  setDesktopCollapsed,
  openDeleteModal,
  setOpenDeleteModal,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(desktopCollapsed));
  }, [desktopCollapsed]);

  /* DESKTOP COLLAPSE */
  const toggleDesktopSidebar = () => {
    setDesktopCollapsed((prev) => !prev);
  };

  /* MOBILE OPEN/CLOSE */
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  /* RESPONSIVE TOGGLE */
  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleDesktopSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  async function createChat() {
    try {
      const response = await dispatch(createChatThunk()).unwrap();

      const newChatId = response?._id || response?.chat?._id;

      if (newChatId) {
        navigate(`/chat/${newChatId}`);
      } else {
        console.error("Failed to find chat ID in thunk response:", response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-5 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        onClick={(e) => e.stopPropagation()}
        className={`absolute z-10 flex h-screen w-67 shrink-0 flex-col border-r border-(--color-surface-container-high) items-center bg-(--color-surface-container-low) lg:bg-transparent p-6 transition-transform duration-400 lg:transition-[width] ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0 ${desktopCollapsed ? "lg:w-22" : "lg:w-67"} `}
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col justify-between gap-6">
              <div className={`flex items-center justify-start px-1`}>
                <div>
                  <span
                    className="cursor-pointer transition-colors duration-200 text-[#DEE5FF]"
                    onClick={handleSidebarToggle}
                  >
                    {window.innerWidth >= 1024 ? desktopCollapsed ? (<TextAlignJustify size={30} />) : (<TextAlignJustify size={30} />) : mobileSidebarOpen ? <TextAlignJustify size={28} /> : <TextAlignJustify size={28} />}
                  </span>
                </div>
              </div>

              <button
                onClick={createChat}
                className="flex cursor-pointer items-center justify-center rounded bg-(--color-primary-container) px-2 py-2.5 text-(--color-on-primary-container) transition-colors duration-200 hover:bg-(--color-secondary-container) hover:text-(--color-on-secondary-container)"
              >
                <div
                  className={`flex items-center transition-all duration-400 ${
                    desktopCollapsed
                      ? "lg:justify-center"
                      : "lg:justify-left gap-1"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <Plus size={20} />
                  </span>
                  <span
                    className={`max-w-35 overflow-hidden leading-none whitespace-nowrap opacity-100 transition-all duration-400 ${
                      desktopCollapsed
                        ? "lg:max-w-0 lg:opacity-0"
                        : "lg:ml-1 lg:max-w-35 lg:opacity-100"
                    }`}
                  >
                    New Chat
                  </span>
                </div>
              </button>
            </div>

            <div
              className={`max-w-125 overflow-hidden whitespace-nowrap opacity-100 ${
                desktopCollapsed
                  ? "lg:max-w-0 lg:opacity-0"
                  : "lg:max-w-125 lg:opacity-100"
              } transition-all duration-400`}
            >
              <RecentChats
                mobileSidebarOpen={mobileSidebarOpen}
                setMobileSidebarOpen={setMobileSidebarOpen}
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
              />
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
