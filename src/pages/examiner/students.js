import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useRouter } from 'next/router';
import Modal from "@/components/ui-components/Modal";
import Table from "@/components/ui-components/Table";
import AddStudentForm from "@/components/AddStudentForm";
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
        key: "last_name",
        heading: "Last Name",
    },

    {
        key: "matric_no",
        heading: "Matric Number",
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


function Students() {
    const [tableData, setTableData] = useState([]);

    const [addStudentModal, setAddStudentModal] = useState(false);
    const [bulkUpload, setBulkUploadModal] = useState(false);
    const [downloadStudentModal, setDownloadStudentModal] = useState(false);
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
    }, []);


    const openViewModal = (studentId) => {
        const selectedStudent = tableData.find(item => item.id === studentId);
        setViewModalData(selectedStudent);
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


    const closeAddCourseModal = () => {
        setAddCourseModal(false);
        window.location.reload();
    };


    const closeDownloadCourseModal = () => {
        setDownloadCourseModal(false);
        window.location.reload();
    };


    const deleteCourse = async (courseId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/Course/delete-properties/${courseId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            if (response.ok) {
                console.log('Course deleted successfully!');
                // Handle success, you may want to fetch the updated data and update the table
                fetchData();
            } else {
                console.error('Failed to delete Course');
                // Handle error, show an error message
                alert('Failed to delete Course!');
            }
        } catch (error) {
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
                const response = await fetch('http://127.0.0.1:8000/students/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const data = await response.json();
                console.log('users',data);
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
                        onClick={openDownloadStudentModal}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    first_name: item.first_name,
                    last_name: item.last_name,
                    matric_no: item.username,
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
                isOpen={addStudentModal}
                heading={"Register Student For Examination"}
                onClose={closeAddStudentModal}
            >
                <AddStudentForm />
            </Modal>

        </ExaminerBaseLayout>

    )

}

export default Students;