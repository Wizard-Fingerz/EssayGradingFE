import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import { useState, useEffect, } from "react";
import { useRouter } from 'next/router';
import {
    FaCloudDownloadAlt,
    FaRegFilePdf,
    FaLongArrowAltDown,
    FaEye,
    FaTrash,
    FaEdit,
} from "react-icons/fa";


const table_column_heading = [
    {
        key: "course",
        heading: "Course",
    },
    {
        key: "examiner",
        heading: "Examiner",
    },
    {
        key: "number_of_questions",
        heading: "Number of Questions",
    },
    {
        key: "duration",
        heading: "Duration",
    },
    {
        key: "instruction",
        heading: "Instruction",
    },
    {
        key: "total_mark",
        heading: "Total Mark",
    },
    {
        key: "start-btn",
        heading: "",
    },
];


function ExamPage() {
    const [tableData, setTableData] = useState([]);
    const [downloadModal, setDownloadModal] = useState(false);

    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/'); // Redirect to the login page if the token is not present
            alert('Redirected to login...')
        }
    }, []);



    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/exam/student-exams/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                console.log("Exams", data);
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const openDownloadModal = () => {
        setDownloadModal(true);
    };

    // const handleClick = (examId, duration, courseName, instruction, totalMark) => {
    //     // Navigate to the exam page with the examId and other details as URL parameters
    //     router.push(`/student/examination/${examId}?duration=${duration}&courseName=${courseName}&instruction=${instruction}&totalMark=${totalMark}`);
    // };

    const handleClick = (examId, duration, courseName, instruction, totalMark, questions) => {

        localStorage.setItem('questions', JSON.stringify(questions));
        // Navigate to the exam page with the examId, other details, and questions as URL parameters
        router.push(`/student/examination/${examId}?duration=${duration}&courseName=${courseName}&instruction=${instruction}&totalMark=${totalMark}`);
    };



    return (
        <StudentBaseLayout>
            <Table
                headingRightItem3={() => (
                    <ActionButton
                        onClick={openDownloadModal}
                        label="Download Exam Pass"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />
                )}
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    course: item.course_name,
                    examiner: item.examiner,
                    number_of_questions: item.questions.length,
                    duration: item.duration,
                    instruction: item.instruction,
                    total_mark: item.total_mark,
                    "start-btn": {
                        component: () => (
                            <ActionButton
                                label="Start Exam"
                                Icon={FaEdit}
                                inverse={true}
                                onClick={() => handleClick(item.course, item.duration, item.course_name, item.instruction, item.total_mark, item.questions)} // Pass the necessary details to handleClick
                                style={{ color: 'green', borderColor: 'green' }}
                            />
                        ),
                    },
                }))}
            />
        </StudentBaseLayout>
    );
}

export default ExamPage;
