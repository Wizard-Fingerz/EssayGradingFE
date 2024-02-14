import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import { useState, useEffect } from "react";


const table_column_heading = [
    {
        key: "comprehension",
        heading: "Comprehension",
    },
    {
        key: "question",
        heading: "Question",
    },

    {
        key: "examiner_answer",
        heading: "Examiner Answer",
    },

    {
        key: "score",
        heading: "Score",
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


function Exams() {
    const [tableData, setTableData] = useState([]);

    const [addExamModal, setAddExamModal] = useState(false);
    const [bulkUpload, setBulkUploadModal] = useState(false);
    const [downloadExamModal, setDownloadExamModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewModalData, setViewModalData] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState(null);

    const openViewModal = (examId) => {
        const selectedExam = tableData.find(item => item.id === examId);
        setViewModalData(selectedExam);
        setViewModal(true);
    };


    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8000/exam/exams-with-questions/', {
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

    
    const openBulkUploadModal = () => {
        setBulkUploadModal(true);
    };

    const openAddExamModal = () => {
        setAddExamModal(true);
    };

    const closeAddExamModal = () => {
        setAddExamModal(false);
        window.location.reload();
    };

    const openDownloadExamModal = () => {
        setDownloadExamModal(true);
    };

    return (
        <ExaminerBaseLayout>

            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openAddExamModal}
                        label="Add Exam"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}

                headingRightItem2={() => (
                    <ActionButton
                        onClick={openBulkUploadModal}
                        label="Bulk Upload"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                headingRightItem3={() => (
                    <ActionButton
                        onClick={openDownloadExamModal}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    comprehension: item.comprehension,
                    question: item.question,
                    examiner_answer: item.examiner_answer,
                    score: item.score,
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
                                onClick={openDeleteModal}
                                style={{ color: 'red', borderColor: 'red' }}
                            />
                        ),
                    },
                }))}

            />


            <Modal
                isOpen={addExamModal}
                heading={"Create Exam"}
                onClose={closeAddExamModal}
            >
                <CreateExamForm />
            </Modal>

        </ExaminerBaseLayout>

    )

}

export default Exams;