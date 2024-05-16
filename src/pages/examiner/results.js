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
        heading: "Matric Number",
    },
    {
        key: "score",
        heading: "Percentage Score",
    },
    {
        key: "grade",
        heading: "Grade",
    },
    {
        key: "enable-btn",
        heading: "",
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
    const handleEnableDisableResult = async (resultId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token not found in local storage');
            return;
        }

        try {
            // Determine whether to enable or disable the result
            const enableResult = !tableData.find(item => item.id === resultId).enabled;

            // Prepare the request body based on the decision
            const formData = new FormData();
            formData.append('is_disabled', enableResult ? 'False' : 'True'); // Use 'True' to disable, 'False' to enable

            // Make a PATCH request to your API to enable/disable the result
            const response = await fetch(`${API_BASE_URL}/exam/enable-disable-result/${resultId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                // If the request is successful, update the table data
                const updatedData = tableData.map(item => {
                    if (item.id === resultId) {
                        // Toggle the enable/disable status for the specific result
                        return {
                            ...item,
                            enabled: enableResult
                        };
                    }
                    return item;
                });
                setTableData(updatedData);
            } else {
                console.error('Failed to enable/disable result');
                // Handle error, show an error message
                alert('Failed to enable/disable result!');
            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network error
        }
    };
    const openDownloadModal = () => {
        setDownloadModal(true);
    };

    const generateAndDownloadPdf = async () => {
        // Generate and download the PDF Exam Slip
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/exam/generate-students-result-pdf/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'student_results.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <ExaminerBaseLayout>
            <Table
                headingRightItem1={() => (
                    <ActionButton
                        onClick={generateAndDownloadPdf}
                        label="Download All"
                        style={{ margin: '0 19px' }}
                    />
                )}
                categoryKey='course_code'
                heading={table_column_heading}
                data={Array.isArray(tableData) ? tableData.map((item) => ({
                    course_code: item.course_code,
                    course_title: item.course_name,
                    student: item.student,
                    score: item.percentage_score,
                    grade: item.grade,
                    "enable-btn": {
                        component: () => (
                            <ActionButton
                                label={item.enabled ? "Disable" : "Enable"}
                                inverse={true}
                                onClick={() => handleEnableDisableResult(item.id)}
                                style={{ color: 'green', borderColor: 'green' }}
                            />
                        ),
                    },
                })) : []}
            />
        </ExaminerBaseLayout>
    );
}

export default Results;
