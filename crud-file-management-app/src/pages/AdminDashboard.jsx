import React from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import StyleEditor from '../components/StyleEditor';
import PublishButton from '../components/PublishButton';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <FileUpload />
            <FileList />
            <StyleEditor />
            <PublishButton />
        </div>
    );
};

export default AdminDashboard;