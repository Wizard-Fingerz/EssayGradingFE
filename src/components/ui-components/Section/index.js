import styles from "./style.module.css";

const Section = ({ title, subTitle, children }) => {
    return (
        <div style={{ marginLeft: 'auto' }}>
            {title && <h2 style={{ marginLeft: '20px' }} className={styles["section-title"]}>{title}</h2>}
            {subTitle && <p style={{ marginLeft: '20px' }} className={styles["section-subtitle"]}>{subTitle}</p>}

            <section className={styles["section-container"]}>
                {children}
            </section>
        </div>
    );
};

export default Section;
