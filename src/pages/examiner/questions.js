import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import { API_BASE_URL } from '@/constants';
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import {
    FaCloudDownloadAlt,
    FaRegFilePdf,
    FaLongArrowAltDown,
    FaEye,
    FaTrash,
    FaEdit,
} from "react-icons/fa";
import QuestionBulkUpload from "@/components/QuestionBulkUpload";
import EditQuestionForm from "@/components/EditExamForm";


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
        key: "edit-btn",
        heading: "",
    },

    {
        key: "delete-btn",
        heading: "",
    },
];


function Questions() {
    const [tableData, setTableData] = useState([]);

    const [addExamModal, setAddExamModal] = useState(false);
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [downloadExamModal, setDownloadExamModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState(null);


    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/'); // Redirect to the login page if the token is not present
            alert('Redirected to login...')
        }
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


    const openEditModal = (courseId) => {
        const selectedCourse = tableData.find(item => item.id === courseId);
        setEditModalData(selectedCourse);
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


    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/exam/examiner-questions/`, {
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

    const closeBulkUploadModal = () => {
        setBulkUploadModal(false);
        window.location.reload();
    };


    const deleteQuestion = async (questionId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/delete-course-question/${questionId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                alert('Question deleted successfully!');
                console.log('Question deleted successfully!');
                // Handle success, you may want to fetch the updated data and update the table
                fetchData();
            } else {
                console.error('Failed to delete Course');
                // Handle error, show an error message
                alert('Failed to delete Course!');
            }
        } catch (error) {
            alert('Network error:', error);
            console.error('Network error:', error);
            // Handle network error
        }
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
                categoryKey='course_code'
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    course_code: item.course_code,
                    course_title: item.course_name,
                    comprehension: item.comprehension,
                    question: item.question,
                    examiner_answer: item.examiner_answer,
                    score: item.question_score,

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
                }))}

            />


            <Modal
                isOpen={addExamModal}
                heading={"Create Exam"}
                onClose={closeAddExamModal}
            >
                <CreateExamForm />
            </Modal>


            <Modal
                isOpen={bulkUploadModal}
                heading={"Bulk Upload Questions"}
                onClose={closeBulkUploadModal}
            >
                {/* Your bulk upload form component will go here */}

                <QuestionBulkUpload />
            </Modal>

            <Modal
                isOpen={editModal}
                heading={"Edit Question"}
                onClose={closeEditModal}
            >
                {/* Your bulk upload form component will go here */}

                <EditQuestionForm />
            </Modal>


            <Modal
                isOpen={deleteModal}
                heading={"Delete Question"}
                onClose={closeDeleteModal}
            >
                {/* Add your components for deleting property details */}
                {/* For example: */}
                <div>
                    <p style={{ color: 'black', marginBottom: '30px' }}>Are you sure you want to delete this question?</p>
                    <ActionButton
                        label="Delete"
                        Icon={FaTrash}
                        inverse={true}
                        onClick={() => {
                            // Handle delete action here
                            deleteQuestion(deleteModalData.id);
                            closeDeleteModal();
                        }}
                        style={{ color: 'red', borderColor: 'red' }}
                    />
                </div>
            </Modal>



        </ExaminerBaseLayout>

    )

}

export default Questions;