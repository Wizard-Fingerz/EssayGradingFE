import React from "react";
import styles from "./paginationButton.module.css";

const PaginationButton = ({ label = "", Icon = null, isActive = false, disabled = false, inverse = false, style = {}, onClick = () => { } }) => {
    const activeStyle = isActive ? { backgroundColor: '#4F0DA3', color: 'white' } : {};
    const disabledStyle = disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {};

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
            style={{ ...style, ...activeStyle, ...disabledStyle }}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon />}
            <span>{label}</span>
        </button>
    );
};

export default PaginationButton;
