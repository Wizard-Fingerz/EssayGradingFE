import React, { useState, useEffect } from 'react';
import styles from './courseRegistration.module.css';
import { API_BASE_URL } from '@/constants';

function CourseRegistrationForm() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);

            try {
                const response = await fetch(`${API_BASE_URL}/exam/courses/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const coursesData = await response.json();
                    console.log(coursesData);
                    setCourses(coursesData);
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCheckboxChange = (courseId) => {
        const isChecked = selectedCourses.includes(courseId);
        if (isChecked) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/exam/student-course-registration/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ courses: selectedCourses }),
            });

            if (response.ok) {
                console.log('Courses registered successfully!');
                // Add any logic you want to perform on successful registration
                alert('Course Registration Successful')
            } else {
                console.error('Failed to register courses');
                alert('Course Registration Failed')
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                {courses.map(course => (
                    <div key={course.id} className={styles.inputCont}>
                        <label className={styles.courses}>
                            {course.code} - {course.title}
                            <input
                                type="checkbox"
                                value={course.id}
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => handleCheckboxChange(course.id)}
                                className={styles.input}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit" className={styles.button}>
                    Register
                </button>
            </form>
        </div>
    );
}

export default CourseRegistrationForm;
