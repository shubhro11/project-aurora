import {
  BrainCog,
  EllipsisVertical,
  LogOut,
  Settings,
  TextAlignJustify,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../../store/reducers/authSlice";

const TitleSection = ({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  deleteModal,
  setDeleteModal,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeChatId = useSelector((state) => state.chat.activeChatId);
  const chatTitle = useSelector((state) => state.chat.chats);
  const mainTitle = chatTitle.find((chat) => chat._id === activeChatId);

  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(mobileSidebarOpen));
  }, [mobileSidebarOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // func for toggling the sidebar
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  const handleAction = (e, callback) => {
    e.stopPropagation();
    setIsOpen(false); // Close menu after action
    callback();
  };

  async function logoutHandler() {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged-out Successfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex w-full items-center border-b border-(--color-surface-container-high) justify-between bg-(--color-surface) p-6 transition-colors duration-200">
      <span
        onClick={toggleMobileSidebar}
        className="cursor-pointer transition-colors duration-200 lg:hidden text-[#DEE5FF]"
      >
        {/* <PanelLeftOpen size={38} strokeWidth={1.5} /> */}
        <TextAlignJustify size={24} />
      </span>

      <div className="flex items-center gap-2">
        <span className="text-(--color-on-surface) transition-colors duration-200">
          <BrainCog size={28} />
        </span>
        <h1 className="text-2xl leading-none font-bold text-(--color-on-tertiary-container) transition-colors duration-200">
          Aurora
        </h1>
      </div>

      <h1 className="hidden text-base font-medium text-(--color-on-tertiary-container) transition-colors duration-200 lg:block">
        {mainTitle?.title}
      </h1>

      <div className="relative inline-block text-left">
        {/* Toggle Button */}

        <div
          ref={menuRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev); // This line is required to actually open/close it
          }}
          className="flex items-center gap-2"
        >
          <span className="cursor-pointer text-(--color-on-surface) transition-colors duration-200">
            <EllipsisVertical />
          </span>
        </div>

        {/* Dropdown Menu with Transition */}
        <ul
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-0 mt-2 block w-42 flex-col overflow-hidden rounded-sm border border-(--color-surface-variant) bg-(--color-surface-container-low) text-(--color-on-surface) shadow-xl transition-all duration-200 ease-in-out ${
            isOpen
              ? "max-h-54 opacity-100"
              : "max-h-0 border-0 py-0 opacity-0 shadow-none"
          }`}
        >
          <li
            onClick={(e) => handleAction(e, logoutHandler)}
            className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-red-400 transition-colors hover:bg-(--color-error) hover:text-(--color-on-error)"
          >
            {/* <a href="#" className="block px-4 py-2 text-sm hover:bg-(--color-tertiary-fixed) transition-colors"> */}
            <span>
              <LogOut size={20} />
            </span>
            <span>Logout</span>
            {/* </a> */}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TitleSection;
