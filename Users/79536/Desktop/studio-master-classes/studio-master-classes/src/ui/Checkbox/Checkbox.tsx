import { FC, ReactNode } from 'react';

interface Checkbox {
  label?: string | ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  size: 'small' | 'medium' | 'large';
  color: 'primary' | 'secondary' | 'tertiary' | 'base';  // Assuming these relate to the border or checkmark color
  disabled?: boolean;
}

export const Checkbox: FC<Checkbox> = ({
  label = "",
  checked = false,
  onChange = Function.prototype,
  size = "small",
  color = "primary",
  disabled = false,
}) => {
  return (
    <label className={`checkbox-container checkbox-${size} checkbox-${color} ${disabled ? 'disabled' : ''}`}>
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="checkmark"></span>
    </label>
  );
};