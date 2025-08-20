import React, { useEffect, useState } from 'react';
import { fetchPublishedFiles } from '../api/index';
import './styles/custom.css';
import { listFiles, getFileUrl, getStyles } from '../../../web/src/api';

const PublicView = () => {
    const [files, setFiles] = useState([]);
    const [styles, setStyles] = useState({ color: '#2563eb', background: '#f1f5f9' });

    useEffect(() => {
        const getFiles = async () => {
        listFiles().then(setFiles);
        getStyles().then(s => s && setStyles(s));
        };

        getFiles();
    }, []);

    return (
        <div style={{ background: styles.background, color: styles.color, minHeight: '100vh', padding: 24 }}>
            <h1 className="text-2xl font-bold mb-4">Published Files</h1>
            <ul className="space-y-2">
                {files.map(f => (
                    <li key={f} className="bg-white rounded p-2 shadow">
                        <a href={getFileUrl(f)} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: styles.color }}>{f}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PublicView;