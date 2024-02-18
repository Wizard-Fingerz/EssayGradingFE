import ExaminerBaseLayout from "@/components/ExaminerBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useState, useEffect } from "react";
import Table from "@/components/ui-components/Table";

const table_column_heading = [
    {
        key: "course",
        heading: "Course",
    },
    {
        key: "score",
        heading: "Score",
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
                const response = await fetch('http://127.0.0.1:8000/exam/exam-results/', {
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
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    course: item.course,
                    score: item.exam_score,
                    grade: item.grade,

                }))}

            />


        </ExaminerBaseLayout>
        
    )
    
}

export default Results;