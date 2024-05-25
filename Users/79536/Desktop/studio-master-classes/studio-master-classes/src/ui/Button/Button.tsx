import { FC, ReactNode } from 'react';

interface Button {
  size: 'medium' | 'small' | 'large';
  background: 'secondary' | 'base';
  color: 'basic' | 'dark';
  children?: string | ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: FC<Button> = ({
  size,
  children,
  background,
  color,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${size} btn-${color} btn-${background}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
