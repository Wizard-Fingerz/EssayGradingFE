import React, { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';

function UploadScriptPerQuestion() {
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [pdfFile, setPdfFile] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/exam/exams-with-questions`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].questions)) {
                    setQuestions(data[0].questions);
                } else {
                    console.error('Error fetching questions: Data is not in expected format');
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/students`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    console.error('Error fetching students: Data is not in expected format');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const handleQuestionChange = (event) => {
        setSelectedQuestion(event.target.value);
    };

    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    const handlePdfFileChange = (event) => {
        setPdfFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('question_id', selectedQuestion);
        formData.append('student_id', selectedStudent);
        if (pdfFile) {
            formData.append('file', pdfFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/single-ocr-grading/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                // Handle success
                console.log("Upload successful");
            } else {
                // Handle error
                console.error('Error uploading file:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleUpload}>
                <div className={styles.inputCont}>
                    <label htmlFor="question">Select Question:</label>
                    <select id="question" value={selectedQuestion} onChange={handleQuestionChange} className={styles.input}>
                        <option value="">Select a question</option>
                        {questions.map((question, index) => (
                            <option key={index} value={question.question}>
                                {question.question}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="student">Select Student:</label>
                    <select id="student" value={selectedStudent} onChange={handleStudentChange} className={styles.input}>
                        <option value="">Select a Student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.student.examination_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="pdfFile">Upload Image File:</label>
                    <input type="file" id="pdfFile" onChange={handlePdfFileChange} className={styles.input} />
                </div>

                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }}>Upload</button>
                </div>
            </form>
        </div>
    );
}

export default UploadScriptPerQuestion;
