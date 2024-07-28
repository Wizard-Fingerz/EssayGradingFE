import React, { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';

function BulkUploadScript() {
    const [examFilters, setExamFilters] = useState({
        subjectCode: '',
        paperNumber: '',
        examType: '',
        year: '',
    });
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [files, setFiles] = useState([]);

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

    const handleStudentSelection = (event) => {
        const { options } = event.target;
        const selected = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedStudents(selected);
    };

    const handleFilesChange = (event) => {
        setFiles(event.target.files);
    };

    const handleBulkUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('subject_code', examFilters.subjectCode);
        formData.append('paper_number', examFilters.paperNumber);
        formData.append('exam_type', examFilters.examType);
        formData.append('year', examFilters.year);
        formData.append('students', JSON.stringify(selectedStudents));
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/bulk-ocr-grading/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
            if (response.ok) {
                alert('Bulk grading initiated successfully');
            } else {
                console.error('Error initiating bulk grading:', response.statusText);
                alert('Error initiating bulk grading');
            }
        } catch (error) {
            console.error('Error initiating bulk grading:', error);
        }
    };

    return (
        <div>
            <form className={styles.form} onSubmit={handleBulkUpload}>
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

                <div className={styles.inputCont}>
                    <label htmlFor="students">Select Students:</label>
                    <select
                        id="students"
                        multiple
                        value={selectedStudents}
                        onChange={handleStudentSelection}
                        className={styles.input}
                    >
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.examination_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputCont}>
                    <label htmlFor="files">Upload Image Files:</label>
                    <input
                        type="file"
                        id="files"
                        multiple
                        onChange={handleFilesChange}
                        className={styles.input}
                    />
                </div>

                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }}>
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BulkUploadScript;
