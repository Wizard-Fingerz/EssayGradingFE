import { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';

function UploadScript() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
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
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);

            try {
                const response = await fetch(`${API_BASE_URL}/students/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (response.ok) {
                    const studentsData = await response.json();
                    console.log(studentsData);
                    setStudents(studentsData);
                } else {
                    console.error('Failed to fetch students');
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("student_id", selectedStudent);
        formData.append("course_id", selectedCourse);

        try {
            const response = await fetch(`${API_BASE_URL}/upload/scripts/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("success");
                alert('Upload Successful');
            } else {
                const data = await response.json();
                alert(data.detail || data.error);
                setUploadStatus("error");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("error");
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputCont}>
                    <label>Student:</label>
                    <select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className={styles.input}
                    >
                        <option value="" disabled>Select student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label>Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className={styles.input}
                    >
                        <option value="" disabled>Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="file">Select PDF File:</label>
                    <input type="file" id="file" accept=".pdf" onChange={handleFileChange} className={styles.input} />
                </div>

                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }}>Upload</button>
                </div>
            </form>
            {uploadStatus === "success" && <p>Upload successful!</p>}
            {uploadStatus === "error" && <p>Error uploading file.</p>}
        </div>
    );
}

export default UploadScript;
