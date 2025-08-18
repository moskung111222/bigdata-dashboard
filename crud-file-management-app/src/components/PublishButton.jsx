import React from 'react';
import { useState } from 'react';
import { publishChanges } from '../api/index';

const PublishButton = () => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handlePublish = async () => {
        setIsPublishing(true);
        setError(null);
        setSuccess(null);

        try {
            await publishChanges();
            setSuccess('Changes published successfully!');
        } catch (err) {
            setError('Failed to publish changes. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handlePublish} 
                disabled={isPublishing} 
                className={`px-4 py-2 text-white ${isPublishing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} rounded`}
            >
                {isPublishing ? 'Publishing...' : 'Publish Changes'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
};

export default PublishButton;