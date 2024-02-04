import React from "react";
import styles from "./style.module.css";

const DualChartsWrapper = ({ children }) => {
  return <div className={styles["section-container"]}>{children}</div>;
};

export default DualChartsWrapper;
