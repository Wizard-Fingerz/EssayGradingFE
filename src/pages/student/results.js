import StudentBaseLayout from "@/components/StudentBaseLayout";
import ActionButton from "@/components/ui-components/ActionButton";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '@/constants';
import { useRouter } from 'next/router';
import Table from "@/components/ui-components/Table";
import Modal from "@/components/ui-components/Modal";

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
                const response = await fetch(`${API_BASE_URL}/exam/exam-results/`, {
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
        <StudentBaseLayout>
            {console.log("tableData:", tableData)}
            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={openDownloadModal}
                        label="Download All"
                        // Icon={FaCloudDownloadAlt}
                        style={{ margin: '0 19px', }}
                    />
                )}
                categoryKey='grade'
                heading={table_column_heading}
                data={tableData.map((item) => ({
                    course_code: item.course_code,
                    course_title: item.course_name,
                    score: item.percentage_score,
                    grade: item.grade,
                }))}
            />
        </StudentBaseLayout>
    )


}

export default Results;