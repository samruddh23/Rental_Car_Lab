import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context
export const CarContext = createContext();

// 2. Create the Provider Component
export const CarProvider = ({ children }) => {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Booking state with LocalStorage persistence for Experiment 4
    const [bookings, setBookings] = useState(() => {
        try {
            const saved = localStorage.getItem('apexdrive_bookings');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('apexdrive_bookings', JSON.stringify(bookings));
        } catch (err) {
            console.error('Failed to save bookings to localStorage:', err);
        }
    }, [bookings]);

    const addBooking = (bookingData) => {
        const newBooking = {
            id: 'BK-' + Date.now().toString().slice(-6),
            createdAt: new Date().toISOString(),
            status: 'Confirmed',
            ...bookingData
        };
        setBookings(prev => [newBooking, ...prev]);
        return newBooking;
    };

    const cancelBooking = (bookingId) => {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    };

    return (
        <CarContext.Provider value={{ 
            fleet, 
            setFleet, 
            loading, 
            setLoading,
            bookings,
            addBooking,
            cancelBooking
        }}>
            {children}
        </CarContext.Provider>
    );
};