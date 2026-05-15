import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import PrismaticBurst from "../utils/PrismaticBurst";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh">
      <div>
        <Navbar />
      </div>

      {/* <div className=""> */}
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
          {/* Aurora Background */}
          <div className="absolute inset-0">
            <PrismaticBurst
              animationType="hover"
              intensity={3}
              speed={0.4}
              distort={15}
              paused={false}
              offset={{ x: 0, y: 0 }}
              hoverDampness={0.35}
              rayCount={0}
              mixBlendMode="lighten"
              colors={["#8E44AD", "#00D4FF","#2ECC71"]}
              color0="#8E44AD"
              color1="#00D4FF"
              color2="#2ECC71"
            />
          </div>

          {/* Overlay Content */}
          <div className="relative z-10 flex w-120 flex-col items-center justify-center gap-3">
            <span className="rounded-4xl border border-(--color-on-secondary-container) px-2 py-1.5 text-xs leading-none font-medium text-(--color-on-secondary-container) uppercase opacity-85">
              Next-Gen Intelligence
            </span>
            <h1 className="w-[90%] text-center text-2xl md:text-4xl font-bold text-(--color-on-tertiary-container) md:w-full">
              Welcome to Aurora AI
            </h1>

            <span className="w-full text-sm lg:text-base text-center text-(--color-on-tertiary-container)">
              An AI that transcends traditional interface. Its an expansive,
              luminous space where complex data transforms into clear,
              actionable dialogue.
            </span>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-(--color-secondary-container) px-6 py-2.5 text-(--color-on-primary-container) transition-colors duration-200 hover:bg-(--color-primary-container) hover:text-(--color-on-secondary-container)"
            >
              Discover Aurora AI
            </button>
          </div>
        </section>
      {/* </div> */}
    </div>
  );
};

export default LandingPage;
