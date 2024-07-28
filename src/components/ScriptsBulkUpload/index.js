import React, { useState } from 'react';
import styles from './bulkUploadScripts.module.css';
import { API_BASE_URL } from '@/constants';

function BulkUploadScriptsWithImages() {
    const [zipFile, setZipFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setZipFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        setIsUploading(true);

        const formData = new FormData();
        formData.append('zip_file', zipFile);

        try {
            const response = await fetch(`${API_BASE_URL}/exam/upload-bulk-answers-with-images/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                console.error('Error uploading files:', response.statusText);
                throw new Error('Error uploading bulk answers with images');
            }

            alert('Bulk answers submitted successfully');
            setZipFile(null);
        } catch (error) {
            alert('Error uploading bulk answers with images');
            console.error('Error uploading files:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleUpload}>
                <div className={styles.inputCont}>
                    <label htmlFor="zipFile">Upload Zip File:</label>
                    <input
                        type="file"
                        id="zipFile"
                        name="zipFile"
                        accept=".zip"
                        onChange={handleFileChange}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.button} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Bulk Answers with Images'}
                </button>
            </form>
        </div>
    );
}

export default BulkUploadScriptsWithImages;
