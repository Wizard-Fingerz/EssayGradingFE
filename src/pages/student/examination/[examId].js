import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./exam.module.css";
import { API_BASE_URL } from '../../../constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

function ExaminationPage() {
    const router = useRouter();
    const { course_id } = router.query;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(7200); // 2 hours in seconds
    const [studentAnswer, setStudentAnswer] = useState('');

    useEffect(() => {
        if (course_id) {

            const fetchQuestions = async () => {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('Token not found in local storage');
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/exam/course-questions/${course_id}/`, {
                        method: 'GET', headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`, // Include the token for authorization

                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setQuestions(data);
                        console.log(data)
                    } else {
                        console.error('Failed to fetch questions');
                    }
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            };

            // Check if course_id is available before making the request
            if (course_id) {
                fetchQuestions();
            } else {
                console.error('Course ID not available.');
            }

        }
    }, []); // Run once on component mount


    // Update timer every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            // Handle timer reaching zero (e.g., submit the exam)
            console.log('Time is up!');
        }
    }, [timer]);

    const handleChange = (value) => {
        setStudentAnswer(value);
    };


    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <Image
                        src="/assets/logo.svg"
                        alt="My Logo"
                        width={400}
                        height={100}
                    />
                </div>
                <div className={styles.exam}>
                    <div className={styles.questionHead}>
                        <div className={styles.question}>
                            {`Question ${currentQuestionIndex + 1}/${questions.length}`}
                            <br />
                            {questions[currentQuestionIndex]?.question}
                        </div>
                        <div className={styles.timer}>Time Left: {formatTime(timer)}</div>
                    </div>
                    <div className={styles.studentAnswer}>
                        <ReactQuill
                            theme="snow" // You can choose different themes, e.g., 'snow', 'bubble', etc.
                            value={studentAnswer}
                            onChange={handleChange}
                            style={{ height: '80%' }}
                        />
                    </div>


                    <div className={styles.navigation}>
                        <button onClick={() => setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}>
                            Previous
                        </button>
                        <button onClick={() => setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1))}>
                            Next
                        </button>
                    </div>
                </div></div>
        </div>
    );

}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default ExaminationPage;