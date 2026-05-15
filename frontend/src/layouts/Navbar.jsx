import { BrainCog, House, TextAlignJustify, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { isAuthenticated, isInitialized, user } = useSelector(
    (state) => state.auth,
  );
 

  return (
    <>
      <div
        className={`fixed z-20 flex w-full flex-col justify-between transition-all duration-200 md:mx-auto md:p-5`}
      >
        <div className="mx-auto flex w-full items-center justify-between p-6 backdrop-blur-sm md:w-170 md:rounded-2xl lg:w-200">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <span className="text-(--color-on-tertiary-container) transition-colors duration-200">
              <BrainCog size={28} />
            </span>
            <h1 className="px-3 text-2xl leading-none font-bold text-(--color-on-tertiary-container) transition-colors duration-200">
              Aurora
            </h1>
          </div>

          <div
            onClick={() => setShowMenu(!showMenu)}
            className="text-(--color-on-surface) transition-colors duration-200 md:hidden"
          >
            {showMenu ? <X size={28} /> : <TextAlignJustify size={28} />}
          </div>

          <div className="hidden md:flex">
            <ul className="flex items-center gap-6 leading-none">
              
              {isAuthenticated && (
                <li
                  onClick={() => navigate("/chat")}
                  className="cursor-pointer px-1 py-2 text-(--color-on-tertiary-container) transition-colors duration-200 hover:text-(--color-primary-container)"
                >
                  Back to Chats
                </li>
              )}
            </ul>
          </div>

          {!isAuthenticated && (
            <div className="hidden md:flex md:gap-2 lg:gap-2">
              <button
                onClick={() => navigate("/register")}
                className="rounded-sm border-2 border-(--color-on-primary-container) px-3 py-2 text-sm text-(--color-on-primary-container) transition-colors duration-200 hover:border-(--color-secondary) hover:bg-(--color-secondary) hover:text-(--color-primary-container)"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-sm bg-(--color-secondary-container) px-3 py-2 text-sm text-(--color-on-primary-container) transition-colors duration-200 hover:bg-(--color-primary-container) hover:text-(--color-on-secondary-container)"
              >
                Login
              </button>
            </div>
          )}
        </div>

        <div
          className={`mx-auto  w-full ${showMenu ? "h-auto p-6" : "min-h-0 p-0"} rounded-br-2xl rounded-bl-2xl backdrop-blur transition-all duration-200 ease-in-out md:hidden ${showMenu ? "max-h-125 overflow-visible opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
        >
          <div
            className={`flex w-full flex-col gap-3 transition-all duration-200 xs:flex-row`}
          >
            {/* <hr className="border border-(--color-outline-variant)" /> */}
            <ul className={`flex ${isAuthenticated ? "w-full" : "w-0"} flex-col items-center`}>
              {isAuthenticated && (
                <li
                  onClick={() => navigate("/chat")}
                  className="w-full rounded-sm bg-(--color-surface-container-high) px-8 py-3 text-center text-(--color-on-surface-variant) transition-colors duration-200 hover:bg-(--color-surface-container-highest) active:bg-(--color-surface-container-lowest)"
                >
                  Back to Chats
                </li>
              )}
              
            </ul>
            {!isAuthenticated && (
              <div className="flex h-full w-full gap-2">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full rounded-sm border-2 border-(--color-on-primary-container) px-3 py-2 text-sm text-(--color-on-primary-container) transition-colors duration-200 hover:border-(--color-secondary) hover:bg-(--color-secondary) hover:text-(--color-primary-container)"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full rounded-sm bg-(--color-secondary-container) px-3 py-2 text-sm text-(--color-on-primary-container) transition-colors duration-200 hover:bg-(--color-primary-container) hover:text-(--color-on-secondary-container)"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
