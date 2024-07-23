import { FC, ReactNode } from "react";

interface Button {
  size: "medium" | "small" | "large" | "miniature";
  backgroung: "primary" | "secondary" | "tertiary" | "transparent";
  color: "accent" | "basic" | "bark";
  children?: string | ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: FC<Button> = ({
  size,
  children,
  backgroung,
  color,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${size} btn-${color} btn-${backgroung}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
