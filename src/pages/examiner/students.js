import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useRouter } from 'next/router';
import Modal from "@/components/ui-components/Modal";
import Table from "@/components/ui-components/Table";
import AddStudentForm from "@/components/AddStudentForm";
import StudentBulkUpload from "@/components/StudentBulkUpload";
import { API_BASE_URL } from '@/constants';
import { useState, useEffect } from "react";
import {
    FaEye,
    FaTrash,
    FaEdit,
} from "react-icons/fa";


const table_column_heading = [
    {
        key: "first_name",
        heading: "First Name",
    },
    {
        key: "other_name",
        heading: "Other Name",
    },
    {
        key: "last_name",
        heading: "Last Name",
    },

    
    {
        key: "center_num",
        heading: "Center Number",
    },

    {
        key: "candidate_no",
        heading: "Candidate Number",
    },

    
    {
        key: "exam_no",
        heading: "Examination Number",
    },

    
    {
        key: "exam_type",
        heading: "Examination Type",
    },

    
    {
        key: "exam_year",
        heading: "Examination Year",
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


function Students() {
    const [tableData, setTableData] = useState([]);

    const [addStudentModal, setAddStudentModal] = useState(false);
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [downloadStudentModal, setDownloadStudentModal] = useState(false);
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



    const deleteStudent = async (studentId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/delete-student/${studentId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                alert('Student deleted successfully!');
                console.log('Student deleted successfully!');
                // Handle success, you may want to fetch the updated data and update the table
                fetchData();
            } else {
                console.error('Failed to delete Student');
                // Handle error, show an error message
                alert('Failed to delete Student!');
            }
        } catch (error) {
            alert('Network error:', error);
            console.error('Network error:', error);
            // Handle network error
        }
    };


    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/students/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                console.log('users', data);
                setTableData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const openAddStudentModal = () => {
        setAddStudentModal(true);
    };


    const openDownloadStudentModal = () => {
        setDownloadStudentModal(true);
    };

    const closeAddStudentModal = () => {
        setAddStudentModal(false);
        window.location.reload();
    };


    const openBulkUploadModal = () => {
        setBulkUploadModal(true);
    };

    const closeBulkUploadModal = () => {
        setBulkUploadModal(false);
        window.location.reload();
    };

    const generateAndDownloadPdf = async () => {
        // Generate and download the PDF Exam Slip
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/generate-students-list-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'student_list.pdf';
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
                        onClick={openAddStudentModal}
                        label="Add Student"
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
                        onClick={generateAndDownloadPdf}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                categoryKey='center_num'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({

                    first_name: item.first_name,
                    other_name: item.other_name,
                    last_name: item.last_name,
                    matric_no: item.username,
                    exam_no: item.student.examination_number ?? '',
                    center_num: item.student.center_number,
                    candidate_no: item.student.candidate_number,
                    exam_type: item.student.exam_type,
                    exam_year: item.student.year,

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
                isOpen={addStudentModal}
                heading={"Register Student For Examination"}
                onClose={closeAddStudentModal}
            >
                <AddStudentForm />
            </Modal>

            <Modal
                isOpen={bulkUploadModal}
                heading={"Bulk Upload Students"}
                onClose={closeBulkUploadModal}
            >
                {/* Your bulk upload form component will go here */}

                <StudentBulkUpload />
            </Modal>

            <Modal
                isOpen={deleteModal}
                heading={"Delete Student"}
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
                            deleteStudent(deleteModalData.id);
                            closeDeleteModal();
                        }}
                        style={{ color: 'red', borderColor: 'red' }}
                    />
                </div>
            </Modal>





        </ExaminerBaseLayout>

    )

}

export default Students;