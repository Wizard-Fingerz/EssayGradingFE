import { useState, useEffect } from 'react';
import styles from "./createExamForm.module.css";
import { API_BASE_URL } from '@/constants';

function CreateExam() {
    const [examData, setExamData] = useState({
        duration: '',
        instruction: '',
        course: '',
        questions: [
            { serial: 1, comprehension: '', question: '', examiner_answer: '', question_score: '' },
        ],
    });


    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const createExam = async () => {
        const token = localStorage.getItem('token');
        setIsLoading(true);

        try {
            const formattedExamData = {
                duration: examData.duration,
                instruction: examData.instruction,
                course: examData.course,
                questions: examData.questions.map(question => ({
                    comprehension: question.comprehension,
                    question: question.question,
                    examiner_answer: question.examiner_answer,
                    question_score: question.question_score,
                })),
            };

            const response = await fetch(`${API_BASE_URL}/exam/exam-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(formattedExamData),
            });

            if (response.ok) {
                alert('Examination Created Successfully');
                // Reset the form after successful submission
                setExamData({
                    duration: '',
                    course: '',
                    instruction: '',
                    questions: [{ serial: 1, comprehension: '', question: '', examiner_answer: '', question_score: '' }],
                });
            } else {
                console.error('Exam creation failed');
                const data = await response.json();
                alert(data.detail || 'Exam creation failed. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
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


    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][field] = value;
        setExamData({ ...examData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        const newSerial = examData.questions.length + 1;
        setExamData({
            ...examData,
            questions: [
                ...examData.questions,
                { serial: newSerial, comprehension: '', question: '', examiner_answer: '', question_score: '' },
            ],
        });
    };


    const removeQuestion = (index) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions.splice(index, 1);
        setExamData({ ...examData, questions: updatedQuestions });
    };


    const closeAddExamModal = () => {
        setAddExamModal(false);
        window.location.reload();
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
                                    placeholder = "HH:MM:SS"
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
                            <div className={styles.inputCont}>
                                <label>Instruction:</label>
                                <input
                                    type="text"
                                    value={examData.instruction}
                                    onChange={(e) => setExamData({ ...examData, instruction: e.target.value })}
                                    className={styles.input}
                                />
                            </div>



                        </div>
                        <div className={styles.right}>
                            <div className={styles.question}>
                                {examData.questions.map((question, index) => (

                                    <div key={index} className={styles.inputCont}>
                                        <label>Question Number: {question.serial}</label><br />
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
                                            <button type="button" onClick={() => removeQuestion(index)} className={styles.button}

                                                style={{ backgroundColor: 'red' }}
                                            >
                                                Remove Question
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>


                            <button type="button" onClick={addQuestion} className={styles.button}>
                                Add Question
                            </button>
                        </div>
                    </div>

                    <div className={styles.inputCont}>
                        <button
                            type="button"
                            className={styles.button}
                            style={{ backgroundColor: '#FFA500' }}
                            onClick={createExam}
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
