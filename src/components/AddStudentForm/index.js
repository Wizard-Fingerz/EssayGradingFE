import { useState, useEffect } from 'react';
import styles from "./addStudent.module.css";
import { API_BASE_URL } from '@/constants';


function AddStudent() {
    const [course, setCourse] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [center_number, setCenterNumber] = useState('');
    const [password, setPassword] = useState('');
    const [candidate_num, setCandidateNumber] = useState('');
    const [exam_num, setExamNo] = useState('');
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        // formData.append('course_id', course);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('matric_number', exam_num);
        formData.append('examination_number', exam_num);
        formData.append('candidate_number', candidate_num);
        formData.append('center_number', center_number);
        formData.append('username', exam_num);
        formData.append('password', password);


        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/student/register/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Student registered successfully!');
                // Handle success, redirect or show a success message

                // Display alert on successful submission
                alert('Student registered successfully!');
                setFirstName('');
                setLastName('');
                setCenterNumber('');
                setCandidateNumber('');
                setExamNo('');
                setPassword('');
                setMatricNo('');

            } else {
                console.error('Failed to register Student');
                // Handle error, show an error message

                // Display alert on failed submission
                alert('Failed to register Student!');

            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network error

        }
    };


    useEffect(() => {
        const fetchCourses = async () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);

            try {
                const response = await fetch(`${API_BASE_URL}/exam/courses-by-examiner/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const coursesData = await response.json();
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
    }, []); // Run this effect only once when the component mounts


    return (
        <div>

            <form className={styles.form} onSubmit={handleFormSubmit}>
            <div className={styles.rowedForm}>

                <div className={styles.left}>

                    <div className={styles.inputCont}>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}

                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputCont}>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}

                            className={styles.input}
                        />

                    </div>

                    <div className={styles.inputCont}>
                        <label>Center Number:</label>
                        <input
                            type="text"
                            value={center_number}
                            onChange={(e) => setCenterNumber(e.target.value)}

                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.right}>
                <div className={styles.inputCont}>
                        <label>Candidate Number:</label>
                        <input
                            type="text"
                            value={candidate_num}
                            onChange={(e) => setCandidateNumber(e.target.value)}

                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputCont}>
                        <label>Examination Number:</label>
                        <input
                            type="text"
                            value={exam_num}
                            onChange={(e) => setExamNo(e.target.value)}

                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputCont}>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                            className={styles.input}
                        />
                    </div>
                </div>

                </div>

                <div className={styles.inputCont}>
                    <button className={styles.button} style={{ backgroundColor: '#FFA500' }} >Submit</button><br />

                </div>
            </form>
        </div>
    );

}

export default AddStudent;