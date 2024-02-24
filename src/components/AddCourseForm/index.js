import { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';


function AddCourse() {
    const [course_title, setCourseTitle] = useState('');
    const [course_code, setCourseCode] = useState('');
    const [course_desc, setCourseDesc] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', course_title);
        formData.append('code', course_code);
        formData.append('description', course_desc);


        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/courses/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Course created successfully!');
                // Handle success, redirect or show a success message

                // Display alert on successful submission
                alert('Course submitted successfully!');

            } else {
                console.error('Failed to create Course');
                // Handle error, show an error message

                // Display alert on failed submission
                alert('Failed to create Course!');

            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network error

        }
    };

    return (
        <div>

            <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.inputCont}>
                    <label>Course Title:</label>
                    <input
                        type="text"
                        value={course_title}
                        onChange={(e) => setCourseTitle(e.target.value)}

                        className={styles.input}
                    />
                </div>
                <div className={styles.inputCont}>
                    <label>Course Code:</label>
                    <input
                        type="text"
                        value={course_code}
                        onChange={(e) => setCourseCode(e.target.value)}

                        className={styles.input}
                    />
                </div><div className={styles.inputCont}>
                    <label>Course Description:</label>
                    <textarea
                        value={course_desc}
                        onChange={(e) => setCourseDesc(e.target.value)}

                        className={styles.input}
                    ></textarea>
                </div>


                <div className={styles.inputCont}>
                    <button className={styles.button} style={{ backgroundColor: '#FFA500' }} >Submit</button><br />

                </div>

            </form>
        </div>
    );

}

export default AddCourse;