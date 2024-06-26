import { useState, useEffect } from 'react';
import styles from "@/pages/page.module.css";
import { API_BASE_URL } from '@/constants';


function StudentBulkUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
    
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
    
        try {
            const response = await fetch(`${API_BASE_URL}/upload/students/`, {
                method: "POST",
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
    
            if (response.ok) {
                setUploadStatus("success");
                alert('Upload Successfull')
            } else {
                const data = await response.json()
                alert(data.detail || data.error)
                setUploadStatus("error");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadStatus("error");
        }
    };
    

    return (
        <div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <p>Make sure the following fields are in your file: </p>
                <b>&lsquo;first_name&rsquo;, &lsquo;last_name&rsquo;, &lsquo;centre_number&rsquo;, &lsquo;candidate_number&rsquo;,  &lsquo;examination_number&rsquo;,&lsquo;password&rsquo;</b>
                <div className={styles.inputCont}>
                    <label htmlFor="file">Select CSV File:</label>
                    <input type="file" id="file" accept=".csv" onChange={handleFileChange} className={styles.input} />
                </div>
                <div className={styles.inputCont}>
                    <button type="submit" className={styles.button} style={{ backgroundColor: '#FFA500' }} >Upload</button>

                </div>
                
            </form>
            {uploadStatus === "success" && <p>Upload successful!</p>}
            {uploadStatus === "error" && <p>Error uploading file.</p>}
        </div>
    );
}

export default StudentBulkUpload;
