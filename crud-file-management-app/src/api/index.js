import axios from 'axios';

const API_URL = 'http://localhost:5000/api/files';

export const fetchFiles = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const uploadFile = async (fileData) => {
    const response = await axios.post(API_URL, fileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const editFile = async (fileId, updatedData) => {
    const response = await axios.put(`${API_URL}/${fileId}`, updatedData);
    return response.data;
};

export const deleteFile = async (fileId) => {
    const response = await axios.delete(`${API_URL}/${fileId}`);
    return response.data;
};