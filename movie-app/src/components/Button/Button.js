import React, { children } from "react";
import styles from "./button.module.scss";
function Button(props) {
  const { children, className } = props;
  return <button className={`${styles.btn} ${className}`}>{children}</button>;
}

export default Button;
