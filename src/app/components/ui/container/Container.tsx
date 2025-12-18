import { ReactNode } from "react";
import  "./Container.scss";
import cn from "classnames"

interface ContainerProps {
  children: ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fullScreen?: boolean;
  noPadding?: boolean;
  as?: React.ElementType;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  fullWidth = false,
  fullHeight = false,
  fullScreen = false,
  noPadding = false,
  as: Component = "div",
  className = "",
  ...props
}) => {
  const containerClasses = cn(
    "container",
    { 
   "container--fullWidth":fullWidth,
    "container--fullHeight":fullHeight,
    "container--fullScreen":fullScreen,
    "container--noPadding":noPadding,
  },
    className,
  )
     return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  );
};

export default Container;

  