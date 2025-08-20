import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFile(null);
            alert('File uploaded successfully!');
        } catch (err) {
            setError('Error uploading file. Please try again.');
        }
    };

    return (
        <div className="file-upload">
            <h2>Upload New File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                {error && <p className="error">{error}</p>}
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default FileUpload;