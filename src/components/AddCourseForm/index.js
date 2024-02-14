import { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';


function AddCourse() {
    const [course_title, setCourseTitle] = useState('');

    return (
        <div className={styles.container}>
        
            <form className={styles.form}>
                <div className={styles.inputCont}>
                    <label>Course Title:</label>
                    <input
                        type="text"
                        value={course_title}
                        onChange={(e) => setCourseTitle(e.target.value)}

                        className={styles.input}
                    />
                </div>

            </form>
        </div>
    );

}

export default AddCourse;