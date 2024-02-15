import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import CreateExamForm from "@/components/CreateExamForm";
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";
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
        key: "course",
        heading: "Course",
    },

    {
        key: "examiner",
        heading: "Examiner",
    },
    {
        key: "number_of_questions",
        heading: "Number of Questions",
    },
    {
        key: "duration",
        heading: "Duration",
    },
    {
        key: "instruction",
        heading: "Instruction",
    },


    {
        key: "total_mark",
        heading: "Total Mark",
    },
    {
        key: "start-exam",
        heading: "",
    },


];


function ExamPage() {
    const [tableData, setTableData] = useState([]);
    const [downloadModal, setDownloadModal] = useState(false);


    const openDownloadModal = () => {
        setDownloadModal(true);
    };
    return (
        <StudentBaseLayout>
            
            <Table

                headingRightItem3={() => (
                    
                    <ActionButton
                        onClick={openDownloadModal}
                        label="Download Exam Pass"
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

export default ExamPage;