import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useState, useEffect } from "react";
import Table from "@/components/ui-components/Table";
import { API_BASE_URL } from '@/constants';

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
        heading: " Matric Number",
    },
    {
        key: "score",
        heading: "Percentage Score",
        // icon: FaLongArrowAltDown,
    },
    {
        key: "grade",
        heading: "Grade",
    },

];


function Results() {
    const [tableData, setTableData] = useState([]);
    const [downloadModal, setDownloadModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {


            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token not found in local storage');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/exam/examiner-exam-results/`, {
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

    const openDownloadModal = () => {
        setDownloadModal(true);
    };

    return (
        <ExaminerBaseLayout>
                        <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openDownloadModal}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />
                )}
                categoryKey='course_code'
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    course_code: item.course_code,
                    course_title: item.course_name,
                    student: item.student,
                    score: item.percentage_score,
                    grade: item.grade,

                }))}

            />


        </ExaminerBaseLayout>
        
    )
    
}

export default Results;