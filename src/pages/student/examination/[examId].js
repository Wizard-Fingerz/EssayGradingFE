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
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/'); // Redirect to the login page if the token is not present
            alert('Redirected to login...')
        }
    }, []);

    useEffect(() => {
        const storedQuestions = localStorage.getItem('questions');
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        } else {
            console.error('Questions not found in local storage.');
        }
    }, []);

    // Inside the handleSubmitAnswer function, strip HTML tags from the studentAnswer before sending it to the backend
    // Inside the handleSubmitAnswer function, strip HTML tags from all student answers before sending them to the backend
    const handleSubmitAnswer = async () => {
        const token = localStorage.getItem('token');

        // Check if the user has already submitted answers
        // const hasSubmitted = localStorage.getItem('hasSubmitted');
        // if (hasSubmitted) {
        //     console.warn('Answers already submitted. You can only submit once.');
        //     return;
        // }

        // Strip HTML tags from all student answers
        const strippedAnswers = {};
        for (const questionId in studentAnswers) {
            if (Object.hasOwnProperty.call(studentAnswers, questionId)) {
                const strippedAnswer = stripHtml(studentAnswers[questionId]);
                strippedAnswers[questionId] = strippedAnswer;
            }
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/exam/submit-answer/${examId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(strippedAnswers),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Exam submitted successfully:', data);

                // Set a flag indicating that the user has submitted answers
                // localStorage.setItem('hasSubmitted', 'true');

                // Logout user and remove token from local storage
                localStorage.removeItem('token');
                router.push('/success-page'); // Navigate to the success page

                // You can handle the response here if needed
            } else {
                console.error('Failed to submit answers:', response.statusText);
                alert('Failed to submit Exam:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    // Function to strip HTML tags from the content
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
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
            console.log('Time is up! Automatically submitting...');
            alert('Time is up! Automatically submitting...');
            handleSubmitAnswer();
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

    useEffect(() => {
        // Load saved student answers from state
        const savedAnswers = studentAnswers[questions[currentQuestionIndex]?.id];
        setStudentAnswer(savedAnswers || ''); // Set the answer to the saved answer or an empty string
    }, [currentQuestionIndex, studentAnswers]);

    // Update the Previous and Next button click handlers to update the Quill box with the saved answer for the target question
    const goToPreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const goToNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
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
                        <button onClick={goToPreviousQuestion}>
                            Previous
                        </button>
                        <button onClick={goToNextQuestion}>
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
