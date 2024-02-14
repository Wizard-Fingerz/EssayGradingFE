import StudentBaseLayout from "@/components/StudentBaseLayout";
import Table from "@/components/ui-components/Table";
import { useState, useEffect } from "react";


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


function StudentDashboard() {
    const [tableData, setTableData] = useState([]);
    return (

        <StudentBaseLayout>

            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openAddMarketerModal}
                        label="Add Marketer"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}
                headingRightItem2={() => (
                    <ActionButton
                        onClick={openDownloadMarketerModal}
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

        </StudentBaseLayout>

    )
}

export default StudentDashboard;