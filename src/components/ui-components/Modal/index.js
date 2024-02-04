import { useEffect, useState } from "react";
import InlineButton from "../InlineButton";
import TextButton from "../TextButton";
import styles from "./modal.module.css";

const Modal = ({
  isOpen = false,
  onClose = () => { },
  heading = '',
  positiveText = '',
  children,
}) => {
  return (
    <>
      {isOpen ? (
        <section className={styles["modal-bg"]}>
          <div className={styles["modal-container"]}>
            <div className={styles["modal-header"]}>
              <button
                onClick={onClose}
                className={styles["close-btn"]}
              >
                X
              </button>
            </div>
            <h3 className={styles["modal-heading"]}>{heading}</h3>
            <div className={styles["modal-body"]}>
              {children}</div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default Modal;
