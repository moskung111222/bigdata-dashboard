import React, { useEffect, useState } from 'react';
import { getStyles, saveStyles } from '../../../web/src/api';

export default function StyleEditor() {
    const [styles, setStyles] = useState({ color: '#2563eb', background: '#f1f5f9' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        getStyles().then(s => s && setStyles(s));
    }, []);

    const handleChange = e => {
        setStyles({ ...styles, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        await saveStyles(styles);
        setSaving(false);
        setSaved(true);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="font-bold mb-2">Style Editor</h2>
            <div className="mb-2">
                <label className="block mb-1">Primary Color</label>
                <input type="color" name="color" value={styles.color} onChange={handleChange} />
                <span className="ml-2">{styles.color}</span>
            </div>
            <div className="mb-2">
                <label className="block mb-1">Background</label>
                <input type="color" name="background" value={styles.background} onChange={handleChange} />
                <span className="ml-2">{styles.background}</span>
            </div>
            <button onClick={handleSave} className="mt-2 px-4 py-1 bg-blue-600 text-white rounded" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
            </button>
            {saved && <span className="ml-2 text-green-600">Saved!</span>}
        </div>
    );
}


