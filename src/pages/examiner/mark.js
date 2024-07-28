import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import { useRouter } from 'next/router';
import { API_BASE_URL } from '@/constants';
import { useState, useEffect } from "react";
import {
    FaCloudDownloadAlt,
    FaRegFilePdf,
    FaLongArrowAltDown,
    FaEye,
    FaTrash,
    FaEdit,
} from "react-icons/fa";
import UploadScript from "@/components/UploadScripts";
import ScriptsBulkUpload from "@/components/ScriptsBulkUpload";
import UploadScriptPerQuestion from "@/components/UploadScriptPerQuestion";



const table_column_heading = [

    {
        key: "subject_code",
        heading: "Subject Code",
    },
    {
        key: "subject_name",
        heading: "Subject Name",
    },

    {
        key: "student",
        heading: " Examination Number",
    },
    {
        key: "question_number",
        heading: "Question Number",
        // icon: FaLongArrowAltDown,
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
        key: "similarity_score_percentage",
        heading: "Plagarism Score",
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

    {
        key: "view-btn",
        heading: "",
    },



    {
        key: "edit-btn",
        heading: "",
    },

    {
        key: "delete-btn",
        heading: "",
    },
];

function MarkExam() {
    const [tableData, setTableData] = useState([]);

    const [uploadScriptModal, setUploadScriptModal] = useState(false);
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState(null);

    const [singleScriptPerQuestionUploadModal, setSingleScriptPerQuestionUploadModalModal] = useState(false);


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


    const openViewModal = (examId) => {
        const selectedExam = tableData.find(item => item.id === examId);
        setViewModalData(selectedExam);
        setViewModal(true);
    };

    const closeViewModal = () => {
        setViewModal(false);
        window.location.reload();
    };


    const openEditModal = (questionId) => {
        const selectedQuestion = tableData.find(item => item.id === questionId);
        setEditModalData(selectedQuestion);
        setEditModal(true);
    };


    const closeEditModal = () => {
        setEditModal(false);
        window.location.reload();
    };


    const openDeleteModal = (questionId) => {
        const selectedCourse = tableData.find(item => item.id === questionId);
        setDeleteModalData(selectedCourse);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteModal(false);
        // Reset the deleteModalData state when the modal is closed
        setDeleteModalData(null);
        // Refresh the page after closing the modal
        window.location.reload();
    };



    const openUploadScriptModal = () => {
        setUploadScriptModal(true);
    };

    const closeUploadScriptModal = () => {
        setUploadScriptModal(false);
        window.location.reload();
    };

    const openBulkUploadModal = () => {
        setBulkUploadModal(true);
    };

    
    const closeBulkUploadModal = () => {
        setBulkUploadModal(false);
        window.location.reload();
    };

    const openUploadPerQuestionModal = () => {
        setSingleScriptPerQuestionUploadModalModal(true);
    };

    
    const closeUploadPerQuestionModal = () => {
        setSingleScriptPerQuestionUploadModalModal(false);
        window.location.reload();
    };

    

    return (
        <ExaminerBaseLayout>

            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openUploadScriptModal}
                        label="Upload Script"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}

                headingRightItem2={() => (
                    <ActionButton
                        onClick={openBulkUploadModal}
                        label="Bulk Scripts Upload"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}

                headingRightItem3={() => (
                    <ActionButton
                        onClick={openUploadPerQuestionModal}
                        label="Upload Script per Question"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                categoryKey='subject_code'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({

                    subject_code: item.course_code,
                    subject_name: item.course_name,
                    student: item.student,
                    question: item.question,
                    question_number: item.question_number,
                    student_answer: item.student_answer,
                    similarity_score_percentage: item.similarity_score_percentage ? `${item.similarity_score_percentage}%` : '0%',
                    student_score: item.student_score,
                    question_score: item.question_score,
                    

                    "view-btn": {
                        component: () => (
                            <ActionButton
                                label="View"
                                Icon={FaEye}
                                inverse={true}
                                onClick={openViewModal}
                                style={{ color: 'blue', borderColor: 'blue' }}
                            />
                        ),
                    },
                    "edit-btn": {
                        component: () => (
                            <ActionButton
                                label="Edit"
                                Icon={FaEdit}
                                inverse={true}
                                onClick={openEditModal}
                                style={{ color: 'green', borderColor: 'green' }}
                            />
                        ),
                    },
                    "delete-btn": {
                        component: () => (
                            <ActionButton
                                label="Delete"
                                Icon={FaTrash}
                                inverse={true}
                                onClick={() => openDeleteModal(item.id)} // Pass item.id to the openDeleteModal function
                                style={{ color: 'red', borderColor: 'red' }}
                            />
                        ),
                    },
                })) : []}

            />



            <Modal
                isOpen={uploadScriptModal}
                heading={"Upload Scripts"}
                onClose={closeUploadScriptModal}
            >
                {/* Your bulk upload form component will go here */}

                <UploadScript />
            </Modal>

            <Modal
                isOpen={bulkUploadModal}
                heading={"Bulk Upload Scripts"}
                onClose={closeBulkUploadModal}
            >
                {/* Your bulk upload form component will go here */}

                <ScriptsBulkUpload />
            </Modal>

            <Modal
                isOpen={singleScriptPerQuestionUploadModal}
                heading={"Upload Scripts per Question"}
                onClose={closeUploadPerQuestionModal}
            >
                {/* Your bulk upload form component will go here */}

                <UploadScriptPerQuestion />
            </Modal>

            



        </ExaminerBaseLayout>
    )

}

export default MarkExam;