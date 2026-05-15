import { ChevronLeft, Eye, EyeOff, Info, LockKeyhole, Mail, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";

import Login_Banner from "../images/arctic-aurora-e-guth.webp";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../store/reducers/authSlice";

const LoginModal = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginError = useSelector((state) => state.auth.error);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Logged-in Successfully");
      navigate("/chat");
      reset();
    } catch (error) {
      toast.error(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-surface-container-lowest) lg:p-4">

      {/* Modal Box */}
      <div className="grid max-h-[95vh] w-[95%] grid-cols-12 overflow-hidden rounded-lg border border-(--color-surface-container-high) bg-(--color-surface-container-low) shadow-xl sm:w-120 md:w-[95%] lg:w-[95%] xl:w-340">

        {/* Left Banner */}
        <div className="relative hidden h-full bg-black bg-cover bg-center bg-no-repeat backdrop-blur-sm md:col-span-6 md:flex lg:col-span-7 lg:items-end xl:col-span-8">

        <div onClick={() => navigate(-1)} className="absolute hidden z-10  top-6 left-6 md:flex gap-1 items-center text-white cursor-pointer">
          <span><ChevronLeft size={20}/></span>
          <span>Back</span>
        </div>

          <img loading='lazy'
            className="h-full w-full object-cover opacity-70"
            src={Login_Banner}
            alt="Sign_Banner"
          />
          <div className="absolute bottom-0 left-0 flex w-full flex-col gap-2 bg-(--glass-bg) p-10">
            <span className="w-fit rounded-xl bg-(--color-tertiary-fixed) px-2 py-1 font-(family-name:--font-body) text-[0.688rem] leading-none tracking-wide text-(--color-tertiary-fixed-dim) uppercase opacity-85">
              Welcome Back
            </span>
            <h1 className="font-(family-name:--font-heading) text-(length:--text-headline-lg-size) leading-(--text-headline-lg-line-height) text-(--color-on-tertiary-container)">
              Reconnect with your intelligence.
            </h1>
            <p className="font-(family-name:--font-body) text-(--color-tertiary-fixed)">
              Pick up exactly where you left off. Your AI companion is ready to
              continue the conversation.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="scrollbar-custom py-10 flex relative col-span-12 max-h-[95vh] min-h-0 overflow-y-auto scrollbar-gutter-both md:col-span-6 lg:col-span-5 xl:col-span-4">

        {/* Back Button */}
        <div onClick={() => navigate(-1)} className="absolute md:hidden top-6 left-4 flex gap-1 items-center text-white cursor-pointer">
          <span><ChevronLeft size={24}/></span>
          {/* <span>Back</span> */}
        </div>

        {/* Cross Button */}
        <div onClick={() => navigate("/")} className="absolute top-6 right-4 flex gap-1 items-center text-white cursor-pointer">
          <span><X size={24}/></span>
          {/* <span>Back</span> */}
        </div>

          {/* Form Scroll */}
          <div className="min-h-0 flex-1 items-center">
            {/*  Form, hr and TnC Span  */}
            <div className="flex w-full flex-col gap-4 p-6 sm:px-8 sm:py-16">

              <div>
                <h1 className="text-center font-(family-name:--font-heading) text-2xl font-bold text-(--color-on-tertiary-container) transition-colors duration-200">
                  Welcome Back
                </h1>
                <p className="mt-1 text-center font-(family-name:--font-body) text-xs text-(--color-tertiary-fixed-dim) opacity-60">
                  Please login to your account
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
              >
                {/* Email */}
                <FormInput
                  labelName={"Email"}
                  type={"email"}
                  name={"email"}
                  autocomplete={"email"}
                  register={register}
                  required={true}
                  placeholder={"Enter your email"}
                  inputIcon={<Mail size={18} />}
                  errors={errors}
                  errorMessage={"Email is required"}
                  errorMessageIcon={<Info size={12} />}
                />

                {/* Password */}
                <FormInput
                  labelName={"Password"}
                  type={"password"}
                  name={"password"}
                  autocomplete={"current-password"}
                  register={register}
                  required={true}
                  placeholder={"Enter your Password"}
                  inputIcon={<LockKeyhole size={18} />}
                  passShowIcon={<EyeOff size={22} />}
                  passHideIcon={<Eye size={22} />}
                  errors={errors}
                  errorMessage={"Password is required"}
                  errorMessageIcon={<Info size={12} />}
                  forgetPassword={true}
                />

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 ${loading ? "cursor-not-allowed bg-[#6f6e81] text-[#c3c5ca]" : "cursor-pointer bg-(--color-tertiary-container) font-(family-name:--font-body) text-(--color-on-tertiary-container) hover:bg-(--color-on-tertiary)"} w-full rounded-lg px-4 py-2.5 font-medium transition-colors duration-200`}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <hr className="h-[0.5px] w-full rounded border border-(--color-outline-variant) transition-colors duration-200" />

              {/* Link to Register */}
              <span className="text-center text-sm leading-none font-(family-name:--font-body) text-(--color-tertiary-fixed) transition-colors duration-200">
                Don't have an account?{" "}
                <Link to="/register">
                  <span className="cursor-pointer font-medium text-(--color-tertiary-fixed-dim) hover:underline">
                    Sign up
                  </span>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
