import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useState, useEffect } from "react";
import Table from "@/components/ui-components/Table";
import { API_BASE_URL } from '@/constants';

const table_column_heading = [
    {
        key: "course_code",
        heading: "Course Code",
    },
    {
        key: "course_title",
        heading: "Course Title",
    },

    {
        key: "student",
        heading: " Candidate Number",
    },
    
    {
        key: "question",
        heading: "Question",
        // icon: FaLongArrowAltDown,
    },

    {
        key: "student_answer",
        heading: " Student Answer",
    },

    {
        key: "student_score",
        heading: "Student Score",
        // icon: FaLongArrowAltDown,
    },
    {
        key: "question_score",
        heading: "Question Score",
    },

];


function Scores() {
    const [tableData, setTableData] = useState([]);
    const [downloadModal, setDownloadModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/exam/examiner-exam-answers-score/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const generateAndDownloadPdf = async () => {
        // Generate and download the PDF Exam Slip
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/exam/generate-exam-answers-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exam_answers.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <ExaminerBaseLayout>
            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={generateAndDownloadPdf}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />
                )}
                categoryKey='course_code'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({

                    course_code: item.course_code,
                    course_title: item.course_name,
                    student: item.student,
                    question: item.question,
                    student_answer: item.student_answer,
                    student_score: item.student_score,
                    question_score: item.question_score,

                })) : []}

            />


        </ExaminerBaseLayout>

    )

}

export default Scores;