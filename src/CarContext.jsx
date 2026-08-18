import React, { createContext, useState } from 'react';

// 1. Create the Context
export const CarContext = createContext();

// 2. Create the Provider Component
export const CarProvider = ({ children }) => {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <CarContext.Provider value={{ fleet, setFleet, loading, setLoading }}>
            {children}
        </CarContext.Provider>
    );
};