import React, { useState, useEffect } from 'react';
import { updateFile } from '../api/index';

const FileEdit = ({ file, onClose }) => {
    const [fileName, setFileName] = useState(file.name);
    const [fileDescription, setFileDescription] = useState(file.description);

    useEffect(() => {
        setFileName(file.name);
        setFileDescription(file.description);
    }, [file]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFile = { ...file, name: fileName, description: fileDescription };
        await updateFile(updatedFile);
        onClose();
    };

    return (
        <div className="file-edit-modal">
            <h2>Edit File</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fileName">File Name:</label>
                    <input
                        type="text"
                        id="fileName"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fileDescription">Description:</label>
                    <textarea
                        id="fileDescription"
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default FileEdit;