// src/helper/PinProvider.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const PinContext = createContext();

// PinProvider component that will wrap your app or specific parts
export const PinProvider = ({ children }) => {
    const [pins, setPins] = useState([]); // Store the pins

    // Provide the pins state and setter function to other components
    return (
        <PinContext.Provider value={{ pins, setPins }}>
            {children}
        </PinContext.Provider>
    );
};

// Custom hook to use pins anywhere in your app
export const usePins = () => {
    const context = useContext(PinContext);
    if (!context) {
        throw new Error('usePins must be used within a PinProvider');
    }
    return context;
};
