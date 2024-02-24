import { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';


function QuestionBulkUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const [courses, setCourses] = useState([]);
    const [duration, setDuration] = useState([]);
    const [course, setCourse] = useState([]);
    const [instruction, setInstruction] = useState([]);
    const [total_mark, setTotalMark] = useState([]);
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
    }, []); // Run this effect only once when the component mounts



    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/upload/questions/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("success");
                alert('Upload Successfull')
            } else {
                const data = await response.json()
                alert(data.detail || data.error)
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
                        <label>Duration:</label>
                        <input
                            type="text"
                            placeholder="HH:MM:SS"
                            value={duration}
                            // onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputCont}>
                        <label>Course:</label>
                        <select
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
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
                        <label>Instruction:</label>
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputCont}>
                        <label>Total Mark:</label>
                        <input
                            type="number"
                            value={total_mark}
                            onChange={(e) => setTotalMark(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                <p>Make sure the following fields are in your file: <b>'comprehension', 'question', 'examiner_answer', 'question_score'</b></p>

                <div className={styles.inputCont}>
                    <label htmlFor="file">Select CSV File:</label>
                    <input type="file" id="file" accept=".csv" onChange={handleFileChange} className={styles.input} />
                </div>
                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }} >Upload</button>

                </div>

            </form>
            {uploadStatus === "success" && <p>Upload successful!</p>}
            {uploadStatus === "error" && <p>Error uploading file.</p>}
        </div>
    );
}

export default QuestionBulkUpload;
