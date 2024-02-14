import { useState, useEffect } from 'react';
import styles from "./createExamForm.module.css";
import { API_BASE_URL } from '@/constants';

function CreateExam() {
    const [examData, setExamData] = useState({
        duration: '',  // Add duration field
        course: '',    // Add course field
        questions: [
            { comprehension: '', question: '', examiner_answer: '', question_score: '' },
        ],
    });

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


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


    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][field] = value;
        setExamData({ ...examData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setExamData({
            ...examData,
            questions: [
                ...examData.questions,
                { comprehension: '', question: '', examiner_answer: '', question_score: '' },
            ],
        });
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions.splice(index, 1);
        setExamData({ ...examData, questions: updatedQuestions });
    };

    const handleSubmission = async () => {
        const token = localStorage.getItem('token');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/exam/create-exam/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(examData),
            });

            if (response.ok) {
                alert('Examination Created Successfully');
                // Reset the form after successful submission
                setExamData({
                    duration: '',
                    course: '',
                    questions: [{ comprehension: '', question: '', examiner_answer: '', question_score: '' }],
                });
            } else {
                console.error('Exam creation failed');
                alert('Exam creation failed. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <div className={styles.container}>
                <form className={styles.form}>
                    {/* <h1>Create Exam</h1> */}
                    <div className={styles.rowedForm}>
                        <div className={styles.left}>
                            <div className={styles.inputCont}>
                                <label>Duration:</label>
                                <input
                                    type="text"
                                    value={examData.duration}
                                    onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.inputCont}>
                                <label>Course:</label>
                                <select
                                    value={examData.course}
                                    onChange={(e) => setExamData({ ...examData, course: e.target.value })}
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

                        </div>
                        <div className={styles.right}>
                            <div className={styles.question}>
                                {examData.questions.map((question, index) => (
                                    <div key={index} className={styles.inputCont}>
                                        <label>Comprehension:</label>
                                        <input
                                            type="text"
                                            value={question.comprehension}
                                            onChange={(e) => handleQuestionChange(index, 'comprehension', e.target.value)}
                                            className={styles.input}
                                        />

                                        <label>Question:</label>
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                            className={styles.input}
                                        />

                                        <label>Examiner Answer:</label>
                                        <input
                                            type="text"
                                            value={question.examiner_answer}
                                            onChange={(e) => handleQuestionChange(index, 'examiner_answer', e.target.value)}
                                            className={styles.input}
                                        />

                                        <label>Question Score:</label>
                                        <input
                                            type="number"
                                            value={question.question_score}
                                            onChange={(e) => handleQuestionChange(index, 'question_score', e.target.value)}
                                            className={styles.input}
                                        />

                                        {examData.questions.length > 1 && (
                                            <button type="button" onClick={() => removeQuestion(index)}>
                                                Remove Question
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>


                            <button type="button" onClick={addQuestion}>
                                Add Question
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputCont}>
                        <button
                            type="button"
                            className={styles.button}
                            style={{ backgroundColor: '#FFA500' }}
                            onClick={handleSubmission}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateExam;
