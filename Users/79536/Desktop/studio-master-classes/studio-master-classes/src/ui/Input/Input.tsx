import { ChangeEvent, MouseEvent, useEffect, FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
interface InputType {
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClick?: (event: MouseEvent<SVGSVGElement>) => void;
    value: string;
    isCloseIcon?: boolean;
    isSearchIcon?: boolean
}

export const Input: FC<InputType> = ({
  placeholder = "", 
  onChange = Function.prototype,
  onClick, 
  value = "", 
  isCloseIcon = false, 
  isSearchIcon = false
 }) => {
 const handleMouseEnter = (event: MouseEvent<HTMLInputElement>) => {
   const parent = event.currentTarget.parentNode as HTMLElement; // Приведение типа
   if (parent && parent.classList) {
     parent.classList.add('highlight');
   }
 };

 const handleMouseLeave = (event: MouseEvent<HTMLInputElement>) => {
   const parent = event.currentTarget.parentNode as HTMLElement; // Приведение типа
   if (parent && parent.classList) {
     parent.classList.remove('highlight');
   }
 };
 
 useEffect(() => {
    const input = document.querySelector('.input');
    const inputContainer = document.querySelector('.input-container');

    const handleFocus = () => {
      inputContainer?.classList?.add('highlight');
    };

    const handleBlur = () => {
      inputContainer?.classList.remove('highlight');
    };

    input?.addEventListener('focus', handleFocus);
    input?.addEventListener('blur', handleBlur);

    return () => {
      input?.removeEventListener('focus', handleFocus);
      input?.removeEventListener('blur', handleBlur);
    };
  }, []);

 return (
   <div className="input-container">
     {value && <div className="input-icons">
       { isCloseIcon && <CloseIcon className="icon" onClick={onClick}/>}
       { isSearchIcon && <SearchIcon className="icon"/>}
     </div>}
     <input
       type="text"
       placeholder={placeholder}
       value={value}
       onChange={(event) => onChange(event)}
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
       className="input"
     />
   </div>
 );
};
