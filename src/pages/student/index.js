import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import Table from "@/components/ui-components/Table";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '@/constants';
import { useRouter } from 'next/router';
import Modal from "@/components/ui-components/Modal";
import CourseRegistrationForm from "@/components/CourseRegistration";
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
        // icon: FaLongArrowAltDown,
    },

    {
        key: "description",
        heading: "Description",
    },

];


function StudentDashboard() {
    const [tableData, setTableData] = useState([]);
    const [courseRegistrationModal, setCourseRegistrationModal] = useState(false);
    const [bulkUpload, setBulkUploadModal] = useState(false);
    const [downloadCourseModal, setDownloadCourseModal] = useState(false);
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


    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/exam/student-courses/`, {
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

    const generateAndDownloadPdf = async () => {
        // Generate and download the PDF Exam Slip
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/exam/generate-exam-slip-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'exam_slip.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };


    const closeDownloadCourseModal = () => {
        setDownloadCourseModal(false);
        window.location.reload();
    };


    const openDownloadCourseModal = () => {
        setDownloadCourseModal(true);
    };

    const openCourseRegistrationModal = () => {
        setCourseRegistrationModal(true);
    };
    const closeCourseRegistrationModal = () => {
        setCourseRegistrationModal(false);
        window.location.reload();
    };


    return (

        <StudentBaseLayout>

            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openCourseRegistrationModal}
                        label="Course Registration"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                headingRightItem2={() => (
                    <ActionButton
                        onClick={generateAndDownloadPdf}
                        label="Print Exam Slip"
                        Icon={FaRegFilePdf}
                        style={{ margin: '0 19px', }}
                    />
                )}

                headingRightItem3={() => (

                    <ActionButton
                        onClick={openDownloadCourseModal}
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

                })) : []}

            />

            <Modal
                isOpen={courseRegistrationModal}
                heading={"Register Course"}
                onClose={closeCourseRegistrationModal}
            >
                <CourseRegistrationForm />
            </Modal>


        </StudentBaseLayout>

    )
}

export default StudentDashboard;