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
import UploadScript from "@/components/UploadScripts";



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
        key: "student",
        heading: "Student",
    },
    {
        key: "answer_scripts",
        heading: "Answer Script",
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

function MarkExam() {
    const [tableData, setTableData] = useState([]);

    const [uploadScriptModal, setUploadScriptModal] = useState(false);

    const openUploadScriptModal = () => {
        setUploadScriptModal(true);
    };

    const closeUploadScriptModal = () => {
        setUploadScriptModal(false);
        window.location.reload();
    };

    return (
        <ExaminerBaseLayout>

            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openUploadScriptModal}
                        label="Upload Script"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />

                )}

                // headingRightItem2={() => (
                //     <ActionButton
                //         onClick={openBulkUploadModal}
                //         label="Bulk Upload"
                //         // Icon={FaCloudDownloadAlt}
                //         style={{ margin: '0 19px', }}
                //     />

                // )}
                // headingRightItem3={() => (
                //     <ActionButton
                //         onClick={openDownloadExamModal}
                //         label="Download All"
                //         Icon={FaCloudDownloadAlt}
                //         style={{ margin: '0 19px', }}
                //     />

                // )}
                categoryKey='course_code'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({

                    course_code: item.course_code,
                    course_title: item.course_name,
                    number_of_questions: item.questions.length,
                    duration: item.duration,
                    instruction: item.instruction,
                    total_mark: item.total_mark,
                    "start-btn": {
                        component: () => (
                            <ActionButton
                                label="Start Exam"
                                Icon={FaEdit}
                                inverse={true}
                                onClick={() => handleInitiationClick(item.id)} // Pass the examId to handleClick
                                style={{ color: 'green', borderColor: 'green' }}
                            />
                        ),
                    },
                    "end-btn": {
                        component: () => (
                            <ActionButton
                                label="End Exam"
                                Icon={FaEdit}
                                inverse={true}
                                onClick={() => handleEndExamClick(item.id)} // Pass the examId to handleClick
                                style={{ color: 'green', borderColor: 'green' }}
                            />
                        ),
                    },

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
                isOpen={uploadScriptModal}
                heading={"Upload Scripts"}
                onClose={closeUploadScriptModal}
            >
                {/* Your bulk upload form component will go here */}

                <UploadScript />
            </Modal>



        </ExaminerBaseLayout>
    )

}

export default MarkExam;