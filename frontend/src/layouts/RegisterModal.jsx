import { ChevronLeft, Eye, EyeOff, Info, LockKeyhole, Mail, Type, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

import Signin_Banner from "../images/ishvbuswc.webp";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../store/reducers/authSlice";

const RegisterModal = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success("Signed-in Successfully");
      navigate("/chat");
      reset();
    } catch (err) {
      console.log(err);
    }
  }
// bg-(--color-surface-container-lowest)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-surface-container-lowest) lg:p-4">

      {/* Modal Box */}
      <div className="grid max-h-[95vh] w-[95%] grid-cols-12 overflow-hidden rounded-lg border border-(--color-surface-container-high) bg-(--color-surface-container-low) shadow-lg sm:w-120 md:w-[95%] lg:w-[95%] xl:w-340">

        {/* Left Banner */}
        <div className="relative hidden h-full bg-black bg-cover bg-center bg-no-repeat backdrop-blur-xl md:col-span-6 lg:col-span-7 xl:col-span-8 md:flex lg:items-end">

        <div onClick={() => navigate(-1)} className="absolute hidden z-10  top-6 left-6 md:flex gap-1 items-center text-white cursor-pointer">
          <span><ChevronLeft size={20}/></span>
          <span>Back</span>
        </div>

          <img loading='lazy'
            className="h-full w-full object-cover opacity-60"
            src={Signin_Banner}
            alt="Sign_Banner"
          />
          <div className="absolute w-full bottom-0 left-0 bg-(--glass-bg) p-10 flex flex-col gap-2">
            <span className="rounded-xl w-fit font-(family-name:--font-body) bg-(--color-tertiary-fixed) leading-none px-2 py-1 text-[0.688rem] tracking-wide text-(--color-tertiary-fixed-dim) uppercase opacity-85">
              Get Started
            </span>
            <h1 className="font-(family-name:--font-heading) text-(length:--text-headline-lg-size) leading-(--text-headline-lg-line-height) text-(--color-on-tertiary-container)">
              Experience a smarter way to work.
            </h1>
            <p className="font-(family-name:--font-body) text-(--color-tertiary-fixed)">
              Join a community of innovators using persistent AI to streamline
              their workflows and never lose a thought.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="scrollbar-custom py-6 relative col-span-12 max-h-[95vh] min-h-0 overflow-y-auto scrollbar-gutter-both md:col-span-6 lg:col-span-5 xl:col-span-4">

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
            <div className="flex w-full flex-col gap-4 p-6 sm:px-8 sm:py-6">
              
              <div>
                <h1 className="text-center text-2xl font-bold font-(family-name:--font-heading) text-(--color-on-tertiary-container)">
                  Create an account
                </h1>
                <p className="mt-1 text-center text-xs font-(family-name:--font-body) text-(--color-tertiary-container)">
                  Fill in the details below to create your account
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 flex flex-col gap-4"
              >
                <div className="w-full flex flex-col gap-1 overflow-auto sm:h-full">
                  {/* First Name */}
                  <FormInput
                    labelName={"First Name"}
                    type={"text"}
                    name={"firstName"}
                    autocomplete={"given-name"}
                    register={register}
                    required={true}
                    placeholder={"Enter your First Name"}
                    inputIcon={<Type size={20} />}
                    errors={errors}
                    errorMessage={"First Name is required"}
                    errorMessageIcon={<Info size={12} />}
                  />

                  {/* Last Name */}
                  <FormInput
                    labelName={"LastName"}
                    type={"text"}
                    name={"lastName"}
                    autocomplete={"family-name"}
                    register={register}
                    required={true}
                    placeholder={"Enter your Last Name"}
                    inputIcon={<Type size={20} />}
                    errors={errors}
                    errorMessage={"Last Name is required"}
                    errorMessageIcon={<Info size={12} />}
                  />

                  {/* Email */}
                  <FormInput
                    labelName={"Email"}
                    type={"email"}
                    name={"email"}
                    autocomplete={"email"}
                    register={register}
                    required={true}
                    placeholder={"Enter your email"}
                    inputIcon={<Mail size={20} />}
                    errors={errors}
                    errorMessage={"Email is required"}
                    errorMessageIcon={<Info size={12} />}
                  />

                  {/* Password */}
                  <FormInput
                    labelName={"Password"}
                    type={"password"}
                    name={"password"}
                    autocomplete={"new-password"}
                    register={register}
                    required={true}
                    placeholder={"Enter your Password"}
                    inputIcon={<LockKeyhole size={20} />}
                    passShowIcon={<EyeOff size={20} />}
                    passHideIcon={<Eye size={20} />}
                    errors={errors}
                    errorMessage={"Password is required"}
                    errorMessageIcon={<Info size={12} />}
                    forgetPassword={false}
                  />

                  {/* TnC */}
                  <div className="mt-3">
                      <label className="flex gap-2 cursor-pointer">
                        <input
                        type="checkbox"
                        className="h-4 w-4 border-[#A4ADC6] bg-[#D9E2FF] leading-none accent-(--color-tertiary-container) transition-all duration-200 checked:bg-(--color-tertiary-fixed)"
                        {...register("terms", { required: true })}
                      />
                      <span className="text-xs font-(family-name:--font-body) text-(--color-tertiary-fixed)">
                        By clicking, I agree to the{" "}
                        <span className="cursor-pointer font-medium text-(--color-tertiary) hover:underline">
                          Privacy Policy
                        </span>{" "}
                        and the{" "}
                        <span className="cursor-pointer font-medium text-(--color-tertiary) hover:underline">
                          Terms & Conditions
                        </span>
                        .
                      </span>
                      </label>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-1 ${loading ? "cursor-not-allowed bg-[#6f6e81] text-[#c3c5ca]" : "cursor-pointer bg-(--color-tertiary-container) font-(family-name:--font-body) text-(--color-on-tertiary-container) hover:bg-(--color-on-tertiary)"} w-full rounded-lg px-4 py-2.5 font-medium transition-colors duration-200`}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>

              <hr className="h-[0.5px] w-full rounded border border-(--color-outline-variant) transition-colors duration-200" />

              {/* Link to Register */}
              <span className="text-center text-sm leading-none font-(family-name:--font-body) text-(--color-tertiary-fixed) transition-colors duration-200">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="cursor-pointer font-medium text-(--color-tertiary-fixed-dim) hover:underline">
                    Login
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

export default RegisterModal;
