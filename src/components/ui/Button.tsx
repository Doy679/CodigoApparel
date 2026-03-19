import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-black text-white hover:bg-neutral-800",
      outline: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
      ghost: "bg-transparent text-black hover:bg-neutral-100"
    };

    const sizes = {
      sm: "h-8 px-4 text-[10px]",
      md: "h-12 px-8 text-[12px]",
      lg: "h-16 px-12 text-[14px]"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.button ref={ref} whileTap={{ scale: 0.98 }} className={classes} {...props}>
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
