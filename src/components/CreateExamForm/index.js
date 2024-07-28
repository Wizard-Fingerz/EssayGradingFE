import { useState, useEffect } from 'react';
import styles from "./createExamForm.module.css";
import { API_BASE_URL } from '@/constants';

function CreateExam() {
    const [examData, setExamData] = useState({
        exam_year: '',
        exam_type: '',
        total_mark: '',
        paper_number: '',
        course: '',
        questions: [
            { 
                serial: 1, 
                comprehension: '', 
                question: '', 
                examiner_answer: '', 
                question_score: '', 
                is_optional: false, 
                sub_questions: [] 
            },
        ],
    });

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const createExam = async () => {
        const token = localStorage.getItem('token');
        setIsLoading(true);

        try {
            const formattedExamData = {
                exam_year: examData.exam_year,
                exam_type: examData.exam_type,
                total_mark: examData.total_mark,
                paper_number: examData.paper_number,
                course: examData.course,
                questions: examData.questions.map((question) => ({
                    comprehension: question.comprehension,
                    question: question.question,
                    question_number: question.serial, // Use the 'serial' field for 'question_number'
                    examiner_answer: question.examiner_answer,
                    question_score: question.question_score,
                    is_optional: question.is_optional,
                    sub_questions: question.sub_questions.map((subQuestion) => ({
                        comprehension: subQuestion.comprehension,
                        question: subQuestion.question,
                        question_number: subQuestion.serial, // Use the 'serial' field for sub-questions as well
                        examiner_answer: subQuestion.examiner_answer,
                        question_score: subQuestion.question_score,
                    })),
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
                setExamData({
                    exam_year: '',
                    exam_type: '',
                    total_mark: '',
                    paper_number: '',
                    course: '',
                    questions: [{ serial: 1, comprehension: '', question: '', examiner_answer: '', question_score: '', is_optional: false, sub_questions: [] }],
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
                    console.error('Failed to fetch subjects');
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][field] = value;
        if (field === 'is_optional') {
            updatedQuestions[index].sub_questions = updatedQuestions[index].sub_questions.map(subQuestion => ({
                ...subQuestion,
                is_optional: value
            }));
        }
        setExamData({ ...examData, questions: updatedQuestions });
        calculateTotalMarks();
    };

    const handleSubQuestionChange = (parentIndex, index, field, value) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[parentIndex].sub_questions[index][field] = value;
        setExamData({ ...examData, questions: updatedQuestions });
        calculateTotalMarks();
    };

    const addSubQuestion = (parentIndex) => {
        const updatedQuestions = [...examData.questions];
        const newSubQuestion = { 
            serial: `${updatedQuestions[parentIndex].serial}${String.fromCharCode(98 + updatedQuestions[parentIndex].sub_questions.length)}`, 
            comprehension: '',
            question: '', 
            examiner_answer: '', 
            question_score: '',
            is_optional: updatedQuestions[parentIndex].is_optional,
        };
        updatedQuestions[parentIndex].sub_questions.push(newSubQuestion);
        setExamData({ ...examData, questions: updatedQuestions });
        calculateTotalMarks();
    };

    const removeSubQuestion = (parentIndex, index) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[parentIndex].sub_questions.splice(index, 1);
        setExamData({ ...examData, questions: updatedQuestions });
        calculateTotalMarks();
    };

    const addQuestion = () => {
        const newSerial = examData.questions.length + 1;
        setExamData({
            ...examData,
            questions: [
                ...examData.questions,
                { serial: newSerial, comprehension: '', question: '', examiner_answer: '', question_score: '', is_optional: false, sub_questions: [] },
            ],
        });
        calculateTotalMarks();
    };

    const removeQuestion = (index) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions.splice(index, 1);
        setExamData({ ...examData, questions: updatedQuestions });
        calculateTotalMarks();
    };

    const calculateTotalMarks = () => {
        let totalMarks = 0;
        const compulsoryMarks = examData.questions.reduce((total, question) => {
            if (!question.is_optional) {
                total += parseFloat(question.question_score || 0);
                total += question.sub_questions.reduce((subTotal, subQuestion) => subTotal + parseFloat(subQuestion.question_score || 0), 0);
            }
            return total;
        }, 0);

        const optionalMarks = examData.questions.reduce((total, question) => {
            if (question.is_optional) {
                total += parseFloat(question.question_score || 0);
                total += question.sub_questions.reduce((subTotal, subQuestion) => subTotal + parseFloat(subQuestion.question_score || 0), 0);
            }
            return total;
        }, 0);

        totalMarks = compulsoryMarks;
        if (optionalMarks > 0) {
            totalMarks += optionalMarks;
        }

        setExamData(prevData => ({ ...prevData, total_mark: totalMarks }));
    };

    return (
        <div className={styles.container}>
            <form className={styles.form}>
                <div className={styles.header}>
                    <div className={styles.inputCont}>
                        <label>Subject:</label>
                        <select
                            value={examData.course}
                            onChange={(e) => setExamData({ ...examData, course: e.target.value })}
                            className={styles.input}
                            required
                        >
                            <option value="" disabled>Select a subject</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputCont}>
                        <label>Exam Year:</label>
                        <input
                            type="number"
                            value={examData.exam_year}
                            onChange={(e) => setExamData({ ...examData, exam_year: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputCont}>
                        <label>Exam Type:</label>
                        <input
                            type="text"
                            value={examData.exam_type}
                            onChange={(e) => setExamData({ ...examData, exam_type: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    
                    <div className={styles.inputCont}>
                        <label>Paper Number:</label>
                        <input
                            type="text"
                            value={examData.paper_number}
                            onChange={(e) => setExamData({ ...examData, paper_number: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputCont}>
                        <label>Total Mark:</label>
                        <input
                            type="number"
                            value={examData.total_mark}
                            readOnly
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.questionsContainer}>
                    {examData.questions.map((question, parentIndex) => (
                        <div key={parentIndex} className={styles.question}>
                            <label>Question Number:</label>
                            <input
                                type="text"
                                value={question.serial}
                                onChange={(e) => handleQuestionChange(parentIndex, 'serial', e.target.value)}
                                className={styles.input}
                            />
                            <div>
                                <label>Is Optional: </label>
                                <input
                                    type='checkbox'
                                    checked={question.is_optional}
                                    onChange={(e) => handleQuestionChange(parentIndex, 'is_optional', e.target.checked)}
                                />
                            </div>
                            <label>Comprehension:</label>
                            <textarea
                                className={styles.textarea}
                                value={question.comprehension}
                                onChange={(e) => handleQuestionChange(parentIndex, 'comprehension', e.target.value)}
                            />
                            <label>Question:</label>
                            <textarea
                                className={styles.textarea}
                                value={question.question}
                                onChange={(e) => handleQuestionChange(parentIndex, 'question', e.target.value)}
                            />
                            <label>Examiner Answer:</label>
                            <textarea
                                className={styles.textarea}
                                value={question.examiner_answer}
                                onChange={(e) => handleQuestionChange(parentIndex, 'examiner_answer', e.target.value)}
                            />
                            <label>Question Score:</label>
                            <input
                                type="number"
                                value={question.question_score}
                                onChange={(e) => handleQuestionChange(parentIndex, 'question_score', e.target.value)}
                                className={styles.input}
                            />
                            <button type="button" onClick={() => addSubQuestion(parentIndex)} className={styles.button}>
                                Add Sub-Question
                            </button>
                            <button type="button" onClick={() => removeQuestion(parentIndex)} className={styles.button}>
                                Remove Question
                            </button>

                            {question.sub_questions.map((subQuestion, index) => (
                                <div key={index} className={styles.subQuestion}>
                                    <label>Sub-Question Number:</label>
                                    <input
                                        type="text"
                                        value={subQuestion.serial}
                                        onChange={(e) => handleSubQuestionChange(parentIndex, index, 'serial', e.target.value)}
                                        className={styles.input}
                                    />
                                    <label>Comprehension:</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={subQuestion.comprehension}
                                        onChange={(e) => handleSubQuestionChange(parentIndex, index, 'comprehension', e.target.value)}
                                    />
                                    <label>Sub-Question:</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={subQuestion.question}
                                        onChange={(e) => handleSubQuestionChange(parentIndex, index, 'question', e.target.value)}
                                    />
                                    <label>Examiner Answer:</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={subQuestion.examiner_answer}
                                        onChange={(e) => handleSubQuestionChange(parentIndex, index, 'examiner_answer', e.target.value)}
                                    />
                                    <label>Sub-Question Score:</label>
                                    <input
                                        type="number"
                                        value={subQuestion.question_score}
                                        onChange={(e) => handleSubQuestionChange(parentIndex, index, 'question_score', e.target.value)}
                                        className={styles.input}
                                    />
                                    <button type="button" onClick={() => removeSubQuestion(parentIndex, index)} className={styles.button}>
                                        Remove Sub-Question
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addQuestion} className={styles.button}>
                    Add Question
                </button>
                <button type="button" onClick={createExam} className={styles.button}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default CreateExam;

