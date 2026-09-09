import React, { createContext, useState, useEffect } from 'react';

import { loginAPI, signupAPI } from './services/api';

// 1. Create the Context
export const CarContext = createContext();

// 2. Create the Provider Component
export const CarProvider = ({ children }) => {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // User Authentication State
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('apexdrive_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

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

    useEffect(() => {
        try {
            if (user) {
                localStorage.setItem('apexdrive_user', JSON.stringify(user));
            } else {
                localStorage.removeItem('apexdrive_user');
            }
        } catch (err) {
            console.error('Failed to save user session:', err);
        }
    }, [user]);

    // Authentication Handlers
    const login = async (emailOrPhone, password) => {
        // Attempt backend MongoDB authentication
        const backendUser = await loginAPI(emailOrPhone, password);
        if (backendUser) {
            setUser(backendUser);
            return backendUser;
        }

        // Mock fallback authentication check
        const loggedInUser = {
            id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
            name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Samruddh Jadhav',
            email: emailOrPhone.includes('@') ? emailOrPhone : 'samruddh.jadhav@ves.ac.in',
            phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98201 45678',
            city: 'Mumbai',
            avatar: 'SJ'
        };
        setUser(loggedInUser);
        return loggedInUser;
    };

    const signup = async (userData) => {
        // Attempt backend MongoDB registration
        const backendUser = await signupAPI(userData);
        if (backendUser) {
            setUser(backendUser);
            return backendUser;
        }

        // Fallback user creation
        const newUser = {
            id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
            name: userData.fullName || 'Samruddh Jadhav',
            email: userData.email,
            phone: userData.phone && userData.phone.startsWith('+91') ? userData.phone : `+91 ${userData.phone || '98201 45678'}`,
            city: userData.city || 'Mumbai',
            avatar: userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'IN'
        };
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        setUser(null);
    };

    // Booking Handlers
    const addBooking = (bookingData) => {
        const newBooking = {
            id: 'BK-IN-' + Date.now().toString().slice(-6),
            createdAt: new Date().toISOString(),
            status: 'Confirmed',
            currency: 'INR',
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
            cancelBooking,
            user,
            login,
            signup,
            logout
        }}>
            {children}
        </CarContext.Provider>
    );
};