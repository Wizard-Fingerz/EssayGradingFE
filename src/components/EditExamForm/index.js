import { useState, useEffect } from 'react';
import styles from "./createExamForm.module.css";
import { API_BASE_URL } from '@/constants';

function EditQuestionForm() {
    const [comprehension, setComprehension] = useState('');
    const [question, setQuestion] = useState('');
    const [examiner_answer, setExaminerAnswer] = useState('');
    const [question_score, setQuestionScore] = useState('');


    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    return (
        <div>
            <div className={styles.container}>
                <form className={styles.form}>
                    {/* <h1>Create Exam</h1> */}
                    <div className={styles.question}>
                        <div className={styles.inputCont}>
                            <label>Comprehension:</label>
                            <input
                                type="text"
                                value={comprehension}
                                onChange={(e) => setComprehension(e.target.value)}
                                className={styles.input}
                            />

                            <label>Question:</label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className={styles.input}
                            />

                            <label>Examiner Answer:</label>
                            <input
                                type="text"
                                value={examiner_answer}
                                onChange={(e) => setExaminerAnswer(e.target.value)}
                                className={styles.input}
                            />

                            <label>Question Score:</label>
                            <input
                                type="number"
                                value={question_score}
                                onChange={(e) => setQuestionScore(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>
                    <div className={styles.inputCont}>
                        <button
                            type="button"
                            className={styles.button}
                            style={{ backgroundColor: '#FFA500' }}
                            // onClick={createExam}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}

export default EditQuestionForm;
