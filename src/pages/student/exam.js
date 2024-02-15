import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import { useState, useEffect,} from "react";
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

    const handleClick = (examId) => {
        // Navigate to the exam page with the examId as a URL parameter
        router.push(`/exam/${examId}`);
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
                    course: item.course,
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
                                onClick={() => handleClick(item.id)} // Pass the examId to handleClick
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
