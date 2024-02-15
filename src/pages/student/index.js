import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import Table from "@/components/ui-components/Table";
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

                headingRightItem3={() => (
                    
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
                    course_code: item.course_code,
                    description: item.description,
                    
                }))}

            />

        </StudentBaseLayout>

    )
}

export default StudentDashboard;