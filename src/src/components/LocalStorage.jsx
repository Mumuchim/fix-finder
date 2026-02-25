import React, { useEffect, useState } from 'react';
import '../css/Local.css';

const SavedPinsUI = () => {
    const [savedPins, setSavedPins] = useState([]);

    useEffect(() => {
        loadPins();
    }, []);

    // Function to load pins from localStorage
    const loadPins = () => {
        const pins = JSON.parse(localStorage.getItem('pins')) || {};
        const pinsArray = Object.entries(pins).map(([id, details]) => ({ id, ...details }));
        setSavedPins(pinsArray);
    };

    // // Function to load pins from localStorage
    // const loadPins = () => {
    //     const pins = JSON.parse(localStorage.getItem('pins')) || []; // Treat it as an array
    //     setSavedPins(pins); // No need to convert object to array
    // };


    const clearPins = () => {
        if (window.confirm('Are you sure you want to delete all saved pins?')) {
            localStorage.removeItem('pins');
            setSavedPins([]); // Clear the state as well
        }
    };

    return (
        <div>
            <h2>Saved Pins</h2>
            {savedPins.length > 0 ? (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Pin ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Coordinates</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Floor</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>User UID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {savedPins.map((pin) => (
                                <tr
                                    key={pin.id}
                                    style={{
                                        backgroundColor: pin.active ? '#d3f9d8' : '#fff', // Highlight active pins
                                    }}
                                >
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pin.id}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <div>
                                            <strong>Top:</strong> {pin.top}, <strong>Left:</strong> {pin.left}
                                        </div>
                                        <div>
                                            <strong>Image:</strong> <img src={pin.imgSrc} alt="Pin" style={{ width: '50px', height: '50px' }} />
                                        </div>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pin.floor}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {pin.user_uid || 'N/A'}
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {pin.active ? 'Active' : 'Inactive'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#d9534f',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                        onClick={clearPins}
                    >
                        Clear All Pins
                    </button>
                </>
            ) : (
                <p>No saved pins.</p>
            )}
        </div>
    );
};

export default SavedPinsUI;