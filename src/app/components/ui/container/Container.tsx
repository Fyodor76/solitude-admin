import { ReactNode } from "react";
import styles from "./Container.module.scss";

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
  const containerClasses = [
    styles.container,
    fullWidth && styles.fullWidth,
    fullHeight && styles.fullHeight,
    fullScreen && styles.fullScreen,
    noPadding && styles.noPadding,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  );
};

export default Container;
