import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./exam.module.css";
import { API_BASE_URL } from '@/constants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

function ExaminationPage() {
    const router = useRouter();
    const { examId, duration, courseName, instruction } = router.query;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [timer, setTimer] = useState(parseDurationToSeconds(duration));
    const [studentAnswer, setStudentAnswer] = useState('');

    useEffect(() => {
        const storedQuestions = localStorage.getItem('questions');
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        } else {
            console.error('Questions not found in local storage.');
        }
    }, []);

    // Inside the handleSubmitAnswer function, send the entire studentAnswers object to the backend
    const handleSubmitAnswer = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://127.0.0.1:8000/exam/submit-answer/${examId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(studentAnswers),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Answers submitted successfully:', data);
                // You can handle the response here if needed
            } else {
                console.error('Failed to submit answers:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

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

    useEffect(() => {
        // Reset the studentAnswer when the currentQuestionIndex changes
        setStudentAnswer('');
    }, [currentQuestionIndex]);

    // Update the handleQuillChange function to update the studentAnswers object with the current question ID and the answer
    const handleQuillChange = (value) => {
        setStudentAnswers(prevAnswers => ({
            ...prevAnswers,
            [questions[currentQuestionIndex]?.id]: value,
        }));
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
                            <h3>Subject: {courseName}</h3><br />
                            <h3>Instruction: {instruction}</h3><br />
                            <h4>
                                {`Question ${currentQuestionIndex + 1}/${questions.length}`}
                            </h4>
                            <br />
                            {questions[currentQuestionIndex]?.question}
                        </div>
                        <div className={styles.timer}>Time Left: {formatTime(timer)}</div>
                    </div>
                    <div className={styles.studentAnswer}>
                        <ReactQuill
                            theme="snow" // You can choose different themes, e.g., 'snow', 'bubble', etc.
                            value={studentAnswer}
                            onChange={handleQuillChange}
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
                        <button onClick={handleSubmitAnswer}>Submit Answer</button>
                    </div>
                </div></div>
        </div>
    );

}

function parseDurationToSeconds(duration) {
    if (!duration) return 0;

    const [hours, minutes, seconds] = duration.split(':').map(Number);

    return hours * 3600 + minutes * 60 + seconds;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default ExaminationPage;