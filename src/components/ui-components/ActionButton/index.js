import React from "react";
import styles from "./actionButton.module.css";

const ActionButton = ({ label = "", Icon = null, isActive = false, inverse = false, style = {}, onClick = () => { } }) => {
  return (
    <button
      className={
        isActive
          ? inverse
            ? `${styles["btn"]} ${styles["inverse"]} ${styles["active"]}`
            : `${styles["btn"]} ${styles["active"]}`
          : inverse
            ? `${styles["btn"]} ${styles["inverse"]}`
            : `${styles["btn"]}`
      }
      style={style}
      onClick={onClick}
    >
      {Icon && <Icon />}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;


