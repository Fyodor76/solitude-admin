import { FC } from 'react';

interface TypeInput {
    border: 'none' | 'primary';
    outline: 'none';
    background: 'transparent' | 'basic';
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    size: 'large';
    padding: 'small';
    borderRadius: 'small'
}

export const Input: FC<TypeInput> = ({border, outline, value, onChange, background, placeholder, size, padding, borderRadius}) => {

    return (
        <input
            className={`input input-${border} input-${outline} input-${background} input-${size} input-${padding} input-${borderRadius}` }
            onChange={onChange}
            value={value}
            placeholder={placeholder}
        />
    )
}