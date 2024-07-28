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
import QuestionBulkUpload from "@/components/QuestionBulkUpload";


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
        key: "number_of_questions",
        heading: "Number of Parent Questions",
    },
    {
        key: "exam_year",
        heading: "Exam year",
    },
    {
        key: "exam_type",
        heading: "Exam Type",
    },
    {
        key: "total_mark",
        heading: "Total Mark",
    },
    // {
    //     key: "start-btn",
    //     heading: "",
    // },

    {
        key: "edit-btn",
        heading: "",
    },

    {
        key: "delete-btn",
        heading: "",
    },
    // {
    //     key: "end-btn",
    //     heading: "",
    // },
];


function Exams() {
    const [tableData, setTableData] = useState([]);

    const [addExamModal, setAddExamModal] = useState(false);
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [downloadExamModal, setDownloadExamModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewModalData, setViewModalData] = useState(null);
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
    }, [router]);

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


    const openDeleteModal = (courseId) => {
        const selectedCourse = tableData.find(item => item.id === courseId);
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


    const openBulkUploadModal = () => {
        setBulkUploadModal(true);
    };

    const closeBulkUploadModal = () => {
        setBulkUploadModal(false);
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
                const response = await fetch(`${API_BASE_URL}/exam/examiner-exams/`, {
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




    const openAddExamModal = () => {
        setAddExamModal(true);
    };

    const closeAddExamModal = () => {
        setAddExamModal(false);
        window.location.reload();
    };

    const openDownloadExamModal = async () => {
        // Generate and download the PDF Exam Slip
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/exam/generate-exam-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exam_list.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }

    };

    const handleInitiationClick = async (examId) => {
        const selectedExam = tableData.find(item => item.id === examId);
        console.log(examId);

        const formData = new FormData();
        formData.append('is_activate', 'True');

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/start-end-exam/${examId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                alert('Exam initiated successfully!');
                console.log('Exam initiated successfully!');
                // // Handle success, you may want to fetch the updated data and update the table
                // fetchData();
            } else {
                console.error('Failed to initiate Exam');
                // Handle error, show an error message
                alert('Failed to initiate Exam!');
            }
        } catch (error) {
            alert('Network error:', error);
            console.error('Network error:', error);
        }
    };

    const handleEndExamClick = async (examId) => {
        const selectedExam = tableData.find(item => item.id === examId);
        console.log(examId);

        const formData = new FormData();
        formData.append('is_activate', 'False');

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/start-end-exam/${examId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                alert('Exam ended successfully!');
                console.log('Exam ended successfully!');
                // // Handle success, you may want to fetch the updated data and update the table
                // fetchData();
            } else {
                console.error('Failed to end Exam');
                // Handle error, show an error message
                alert('Failed to end Exam!');
            }
        } catch (error) {
            alert('Network error:', error);
            console.error('Network error:', error);
        }
    };



    const deleteExam = async (examId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/exam/delete-exam/${examId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                alert('Exam deleted successfully!');
                console.log('Exam deleted successfully!');
                // Handle success, you may want to fetch the updated data and update the table
                fetchData();
            } else {
                console.error('Failed to delete Exam');
                // Handle error, show an error message
                alert('Failed to delete Exam!');
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
                        Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                categoryKey='subject_code'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({

                    subject_code: item.course_code,
                    subject_name: item.course_name,
                    number_of_questions: item.questions.length,
                    exam_type: item.exam_type,
                    exam_year: item.exam_year,
                    // instruction: item.instruction,
                    total_mark: item.total_mark,
                    // "start-btn": {
                    //     component: () => (
                    //         <ActionButton
                    //             label="Start Exam"
                    //             Icon={FaEdit}
                    //             inverse={true}
                    //             onClick={() => handleInitiationClick(item.id)} // Pass the examId to handleClick
                    //             style={{ color: 'green', borderColor: 'green' }}
                    //         />
                    //     ),
                    // },
                    // "end-btn": {
                    //     component: () => (
                    //         <ActionButton
                    //             label="End Exam"
                    //             Icon={FaEdit}
                    //             inverse={true}
                    //             onClick={() => handleEndExamClick(item.id)} // Pass the examId to handleClick
                    //             style={{ color: 'green', borderColor: 'green' }}
                    //         />
                    //     ),
                    // },
                    
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
                isOpen={deleteModal}
                heading={"Delete Exam"}
                onClose={closeDeleteModal}
            >
                {/* Add your components for deleting property details */}
                {/* For example: */}
                <div>
                    <p style={{ color: 'black', marginBottom: '30px' }}>Are you sure you want to delete this exam?</p>
                    <ActionButton
                        label="Delete"
                        Icon={FaTrash}
                        inverse={true}
                        onClick={() => {
                            // Handle delete action here
                            deleteExam(deleteModalData.id);
                            closeDeleteModal();
                        }}
                        style={{ color: 'red', borderColor: 'red' }}
                    />
                </div>
            </Modal>


        </ExaminerBaseLayout>

    )

}

export default Exams;