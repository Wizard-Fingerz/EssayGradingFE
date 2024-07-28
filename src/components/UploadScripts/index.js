import React, { useState, useEffect, useRef } from 'react';
import styles from "./uploadScripts.module.css"; // Use the same CSS file as CreateExam
import { API_BASE_URL } from '@/constants';

function UploadScripts() {
    const [examFilters, setExamFilters] = useState({
        subjectCode: '',
        paperNumber: '',
        examType: '',
        year: '',
    });
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [studentAnswers, setStudentAnswers] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRefs = useRef({}); // To hold references to all file input elements

    useEffect(() => {
        const fetchQuestions = async () => {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                course__code: examFilters.subjectCode,
                paper_number: examFilters.paperNumber,
                exam_type: examFilters.examType,
                exam_year: examFilters.year,
            }).toString();

            try {
                const response = await fetch(`${API_BASE_URL}/exam/exams-with-questions/?${queryParams}`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                console.log('Fetched Questions:', data);
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, [examFilters]);

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/students`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setExamFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    const handleAnswerChange = (questionId, file) => {
        setStudentAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: file,
        }));
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setIsUploading(true);  // Set uploading state to true
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('student_id', selectedStudent);

        Object.keys(studentAnswers).forEach((questionId) => {
            if (questionId) {
                formData.append('question_ids', questionId);
                formData.append('files', studentAnswers[questionId]);
            }
        });

        try {
            const response = await fetch(`${API_BASE_URL}/exam/ocr-per-student-script/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                console.error('Error uploading files:', response.statusText);
                throw new Error('Error uploading student answers');
            }

            alert('Student answers submitted successfully');
            setSelectedStudent('');
            setStudentAnswers({});
            // Clear file input fields
            Object.values(fileInputRefs.current).forEach(input => {
                if (input) input.value = '';
            });
        } catch (error) {
            alert('Error uploading student answers');
            console.error('Error uploading files:', error);
        } finally {
            setIsUploading(false);  // Set uploading state to false
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleUpload}>
                <div className={styles.header}>
                    <div className={styles.inputCont}>
                        <label htmlFor="subjectCode">Subject Code:</label>
                        <input
                            type="text"
                            id="subjectCode"
                            name="subjectCode"
                            value={examFilters.subjectCode}
                            onChange={handleFilterChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputCont}>
                        <label htmlFor="paperNumber">Paper Number:</label>
                        <input
                            type="text"
                            id="paperNumber"
                            name="paperNumber"
                            value={examFilters.paperNumber}
                            onChange={handleFilterChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputCont}>
                        <label htmlFor="examType">Exam Type:</label>
                        <input
                            type="text"
                            id="examType"
                            name="examType"
                            value={examFilters.examType}
                            onChange={handleFilterChange}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputCont}>
                        <label htmlFor="year">Year:</label>
                        <input
                            type="number"
                            id="year"
                            name="year"
                            value={examFilters.year}
                            onChange={handleFilterChange}
                            className={styles.input}
                        />
                    </div>
                </div>
                <div className={styles.inputCont}>
                    <label htmlFor="student">Select Student:</label>
                    <select
                        id="student"
                        value={selectedStudent}
                        onChange={handleStudentChange}
                        className={styles.input}
                    >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.username}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.questionsContainer}>
                    {questions.map((exam, examIndex) => (
                        <div key={examIndex} className={styles.examBlock}>
                            {exam.questions.map((question, index) => (
                                <div key={index} className={styles.questionBlock}>
                                    <div className={styles.questionHead}>
                                        <span style={{ fontWeight: '500' }}>
                                            {question.course_name} (Question Number: {question.question_number}) {question.question}
                                        </span>
                                        <span>(Score: {question.question_score} marks)</span>
                                    </div>
                                    <div className={styles.subQuestionBlock}>
                                        <input
                                            type="file"
                                            id={`question-${index}`}
                                            onChange={(e) =>
                                                handleAnswerChange(question.id, e.target.files[0])
                                            }
                                            className={styles.input}
                                            ref={el => fileInputRefs.current[`question-${index}`] = el}
                                        />
                                    </div>
                                    {question.sub_questions && question.sub_questions.length > 0 && (
                                        <div className={styles.subQuestionsContainer}>
                                            {question.sub_questions.map((subQuestion, subIndex) => (
                                                <div key={subIndex} className={styles.subQuestionBlock}>
                                                    <div className={styles.subQuestionHead}>
                                                        <span style={{ fontWeight: '500' }}>
                                                            {subQuestion.course_name} (Question Number: {subQuestion.question_number}) {subQuestion.question}
                                                        </span>
                                                        <span>(Score: {subQuestion.question_score} marks)</span>
                                                    </div>
                                                    <div className={styles.subQuestionBlock}>
                                                        <input
                                                            type="file"
                                                            id={`sub-question-${subIndex}`}
                                                            onChange={(e) =>
                                                                handleAnswerChange(subQuestion.id, e.target.files[0])
                                                            }
                                                            className={styles.input}
                                                            ref={el => fileInputRefs.current[`sub-question-${subIndex}`] = el}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button type="submit" className={styles.button} disabled={isUploading}>
                    {isUploading ? 'Uploading script...' : 'Upload Answers'}
                </button>
            </form>
        </div>
    );
}

export default UploadScripts;
