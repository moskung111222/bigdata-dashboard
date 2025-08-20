import React, { useEffect, useState } from 'react';
import { listFiles, deleteFile, getFileUrl } from '../../../web/src/api';

export default function FileList({ onEdit }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await listFiles();
            setFiles(data);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDelete = async (filename) => {
        if (!window.confirm('Delete this file?')) return;
        await deleteFile(filename);
        fetchFiles();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2 className="font-bold mb-2">Files</h2>
            <ul className="space-y-2">
                {files.map(f => (
                    <li key={f} className="flex items-center justify-between bg-gray-100 rounded p-2">
                        <a href={getFileUrl(f)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{f}</a>
                        <div>
                            <button onClick={() => onEdit && onEdit(f)} className="mr-2 text-yellow-600">Edit</button>
                            <button onClick={() => handleDelete(f)} className="text-red-600">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
import React, { useEffect, useState } from 'react';
import { fetchFiles, deleteFile } from '../api/index';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const getFiles = async () => {
            const fileData = await fetchFiles();
            setFiles(fileData);
        };
        getFiles();
    }, []);

    const handleDelete = async (fileId) => {
        await deleteFile(fileId);
        setFiles(files.filter(file => file.id !== fileId));
    };

    return (
        <div className="file-list">
            <h2>Uploaded Files</h2>
            <ul>
                {files.map(file => (
                    <li key={file.id} className="file-item">
                        <span>{file.name}</span>
                        <button onClick={() => handleDelete(file.id)}>Delete</button>
                        <button>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
