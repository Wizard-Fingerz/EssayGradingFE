import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import AddCourseForm from "@/components/AddCourseForm";
import { useState, useEffect } from "react";
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
        key: "title",
        heading: "Title",
    },
    {
        key: "course_code",
        heading: "Course Code",
    },

    {
        key: "description",
        heading: "Description",
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


function ExaminerDashboard() {
    const [tableData, setTableData] = useState([]);

    const [addCourseModal, setAddCourseModal] = useState(false);
    const [downloadCourseModal, setDownloadCourseModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [viewModalData, setViewModalData] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteModalData, setDeleteModalData] = useState(null);

    const openViewModal = (courseId) => {
        const selectedCourse = tableData.find(item => item.id === courseId);
        setViewModalData(selectedCourse);
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
            const response = await fetch(`http://127.0.0.1:8000/course/delete-course/${courseId}/`, {
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
                const response = await fetch('http://127.0.0.1:8000/exam/courses-by-examiner/', {
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

    const openAddCourseModal = () => {
        setAddCourseModal(true);
    };


    const openDownloadCourseModal = () => {
        setDownloadCourseModal(true);
    };


    return (

        <ExaminerBaseLayout>
            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openAddCourseModal}
                        label="Add Course"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                headingRightItem2={() => (
                    <ActionButton
                        onClick={openDownloadCourseModal}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    title: item.title,
                    course_code: item.code,
                    description: item.description,
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
                isOpen={addCourseModal}
                heading={"Add Course"}
                onClose={closeAddCourseModal}
            >
                <AddCourseForm />
            </Modal>

        </ExaminerBaseLayout>

    )
}

export default ExaminerDashboard;