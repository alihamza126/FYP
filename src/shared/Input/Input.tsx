import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  onIconClick?: () => void; // 👈 Handler for icon click
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      sizeClass = "h-11 px-4 py-3",
      fontClass = "text-sm font-normal",
      rounded = "rounded-2xl",
      icon,
      iconPosition = "start",
      onIconClick,
      type = "text",
      ...args
    },
    ref
  ) => {
    const iconCommonClasses =
      "absolute top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer";

    return (
      <div className="relative w-full">
        {icon && iconPosition === "start" && (
          <span className={`${iconCommonClasses} left-3`} onClick={onIconClick}>
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          className={`block w-full border-black focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-white dark:border-neutral-700 dark:focus:ring-primary-6000 dark:focus:ring-opacity-25 dark:bg-neutral-900 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 ${
            icon ? (iconPosition === "start" ? "pl-9" : "pr-9") : ""
          } ${rounded} ${fontClass} ${sizeClass} ${className}`}
          {...args}
        />

        {icon && iconPosition === "end" && (
          <span className={`${iconCommonClasses} right-3`} onClick={onIconClick}>
            {icon}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
