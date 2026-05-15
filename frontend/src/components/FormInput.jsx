import { useState } from "react";

const FormInput = ({
  labelName,
  type,
  name,
  autocomplete,
  register,
  required,
  placeholder,
  inputIcon,
  passShowIcon,
  passHideIcon,
  errors,
  errorMessage,
  errorMessageIcon,
  forgetPassword,
}) => {
  const hasError = errors?.[name];
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs leading-none font-medium tracking-widest text-(--color-tertiary) font-(family-name:--font-body) uppercase">
        <small>{labelName}</small>
      </span>

      <div
        className={`w-full bg-(--color-surface-container-high) p-2.5 ${hasError ? "border-[#FF6E84]" : "border-(--color-outline-variant) focus-within:border-(--color-outline)"} flex items-center gap-3 rounded-lg border-2 transition-colors duration-200`}
      >
        <span
          className={`${hasError ? "text-[#FF6E84]" : "text-(--color-outline)"} transition-colors duration-200`}
        >
          {inputIcon}
        </span>

        <input
          className="inset w-full text-[0.9rem] mt-0.5 font-(family-name:--font-body) placeholder:font-(family-name:--font-body) text-(--color-on-surface) transition-colors duration-200 outline-none placeholder:text-(--color-outline)"
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          {...register(name, {
            required: required,
            message: `${errorMessage}`,
          })}
          name={name}
          autoComplete={autocomplete === undefined ? "off" : autocomplete}
          placeholder={placeholder}
        />

        <span
          onClick={() => setShowPassword(!showPassword)}
          className={`${type === "password" ? "block" : "hidden"} text-(--color-outline) cursor-pointer transition-colors duration-200`}
        >
          {showPassword ? passShowIcon : passHideIcon}
        </span>
      </div>

      <div
        className={`flex items-center ${forgetPassword ? "justify-between" : "justify-end"}`}
      >
        <span
          className={`${forgetPassword ? "block" : "hidden"} text-sm leading-none text-(--color-tertiary) hover:underline`}
        >
          <small className="leading-none font-(family-name:--font-body) cursor-pointer">forget password?</small>
        </span>

        <div className="item-center flex gap-0.5">
          <span
            className={`${hasError ? "opacity-100" : "opacity-0"} text-sm leading-none text-[#FF6E84] transition-all duration-200`}
          >
            {errorMessageIcon}
          </span>
          <span
            className={`${hasError ? "opacity-100" : "opacity-0"} text-xs leading-none font-(family-name:--font-body) text-[#FF6E84] transition-all duration-200`}
          >
            {errorMessage}
          </span>
        </div>
      </div>
    </label>
  );
};

export default FormInput;
