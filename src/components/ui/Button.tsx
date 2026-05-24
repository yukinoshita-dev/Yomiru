import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-zinc-700 text-zinc-100 hover:bg-zinc-600",
    danger: "bg-red-700 text-white hover:bg-red-800",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
