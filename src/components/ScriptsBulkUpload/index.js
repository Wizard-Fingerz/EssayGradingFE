import React, { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';

function ScriptsBulkUpload() {
    const [csvFile, setCsvFile] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState('');

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

    const handleCsvFileChange = (event) => {
        const file = event.target.files[0];
        setCsvFile(file);
    };

    const handlePdfFilesChange = (event) => {
        const files = event.target.files;
        setPdfFiles([...pdfFiles, ...files]);
    };

    const handleQuestionChange = (event) => {
        setSelectedQuestion(event.target.value);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (csvFile) {
            formData.append('csv_file', csvFile);
        }
        pdfFiles.forEach((file, index) => {
            formData.append(`pdf_file_${index}`, file);
        });
        formData.append('question_id', selectedQuestion);  // Ensure selectedQuestion is the question ID

        try {
            const response = await fetch(`${API_BASE_URL}/exam/batch-ocr-grading/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                console.log('Files uploaded successfully');
            } else {
                const errorData = await response.json();
                console.error('Error uploading files:', response.statusText, errorData);
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleUpload}>
                <p>Make sure the following fields are in your file: </p>
                <b>&lsquo;exam_number&rsquo;, &lsquo;answer_sheet_path&rsquo;</b>
                
                <div className={styles.inputCont}>
                    <label htmlFor="question">Select Question:</label>
                    <select id="question" value={selectedQuestion} onChange={handleQuestionChange} className={styles.input}>
                        <option value="">Select a question</option>
                        {questions.map((question) => (
                            <option key={question.id} value={question.id}>
                                {question.question}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="csvFile">Select CSV File:</label>
                    <input type="file" id="csvFile" accept=".csv" onChange={handleCsvFileChange} className={styles.input} />
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="pdfFiles">Upload PDF Files:</label>
                    <input type="file" id="pdfFiles" accept=".pdf" multiple onChange={handlePdfFilesChange} className={styles.input} />
                </div>

                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }}>Upload</button>
                </div>
            </form>
        </div>
    );
}

export default ScriptsBulkUpload;
