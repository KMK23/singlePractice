import React, { children } from "react";
import styles from "./button.module.scss";
function Button(props) {
  const { children, className, onClick } = props;
  return (
    <button className={`${styles.btn} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
