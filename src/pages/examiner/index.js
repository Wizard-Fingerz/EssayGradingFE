import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
import AddCourseForm from "@/components/AddCourseForm";
import CourseBulkUpload from "@/components/CourseBulkUpload";
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


const table_column_heading = [
    {
        key: "title",
        heading: "Title",
    },
    {
        key: "course_code",
        heading: "Subject Code",
    },

    {
        key: "description",
        heading: "Description",
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
    const [bulkUploadModal, setBulkUploadModal] = useState(false);
    const [downloadCourseModal, setDownloadCourseModal] = useState(false);
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
            const response = await fetch(`${API_BASE_URL}/exam/delete-course/${courseId}/`, {
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
                const response = await fetch(`${API_BASE_URL}/exam/courses-by-examiner/`, {
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

    const openBulkCourseUploadModal = () => {
        setBulkUploadModal(true);
    };
    
    const generateAndDownloadPdf = async () => {
        // Generate and download the PDF
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/exam/generate-courses-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'course_list.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };


    const closeBulkUploadModal = () => {
        setBulkUploadModal(false);
        window.location.reload();
    };


    return (

        <ExaminerBaseLayout>
            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openAddCourseModal}
                        label="Add Subject"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                headingRightItem2={() => (
                    <ActionButton
                        onClick={openBulkCourseUploadModal}
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
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({
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
                                onClick={() => openDeleteModal(item.id)} // Pass item.id to the openDeleteModal function
                                style={{ color: 'red', borderColor: 'red' }}
                            />
                        ),
                    },
                })) : []}



            />

            <Modal
                isOpen={addCourseModal}
                heading={"Add Subject"}
                onClose={closeAddCourseModal}
            >
                <AddCourseForm />
            </Modal>

            
            <Modal
                isOpen={bulkUploadModal}
                heading={"Bulk Upload Subject"}
                onClose={closeBulkUploadModal}
            >
                {/* Your bulk upload form component will go here */}

                <CourseBulkUpload />
            </Modal>

            

            <Modal
                isOpen={deleteModal}
                heading={"Delete Course"}
                onClose={closeDeleteModal}
            >
                {/* Add your components for deleting property details */}
                {/* For example: */}
                <div>
                    <p style={{ color: 'black', marginBottom: '30px' }}>Are you sure you want to delete this course?</p>
                    <ActionButton
                        label="Delete"
                        Icon={FaTrash}
                        inverse={true}
                        onClick={() => {
                            // Handle delete action here
                            deleteCourse(deleteModalData.id);
                            closeDeleteModal();
                        }}
                        style={{ color: 'red', borderColor: 'red' }}
                    />
                </div>
            </Modal>


        </ExaminerBaseLayout>

    )
}

export default ExaminerDashboard;