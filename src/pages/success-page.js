import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./page.module.css";

function SuccessPage() {
    return (

        <div className={styles.body}>
            <div className={styles.container}>

                <div className={styles.form}>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/assets/logo.svg"
                            alt="My Logo"
                            width={400}
                            height={100}
                        />
                    </div>
                    <div className={styles.homeText}>
                        <h1>Exam submitted successfully, You can move out of the hall</h1>

                    </div>
                </div>
            </div>
        </div>
    );

}

export default SuccessPage;