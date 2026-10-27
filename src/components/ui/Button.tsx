import type { ButtonHTMLAttributes, ReactElement } from "react";
import { ButtonVariant, buttonClasses } from "./button-styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps): ReactElement {
  return <button className={`${buttonClasses(variant)} ${className}`} {...props} />;
}