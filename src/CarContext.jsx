import React, { createContext, useState, useEffect } from 'react';

import { 
    loginAPI, 
    signupAPI, 
    getMeAPI,
    createCarAPI, 
    updateCarAPI, 
    deleteCarAPI, 
    updateBookingStatusAPI 
} from './services/api';

// 1. Create the Context
export const CarContext = createContext();

// 2. Create the Provider Component
export const CarProvider = ({ children }) => {
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // User Authentication & JWT State (Experiment 7)
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem('apexdrive_token') || null;
        } catch {
            return null;
        }
    });

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('apexdrive_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Booking state with LocalStorage persistence for Experiment 4 & 6
    const [bookings, setBookings] = useState(() => {
        try {
            const saved = localStorage.getItem('apexdrive_bookings');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Verify token with backend on mount
    useEffect(() => {
        const verifySession = async () => {
            if (token) {
                const refreshedUser = await getMeAPI();
                if (refreshedUser) {
                    setUser(refreshedUser);
                }
            }
        };
        verifySession();
    }, [token]);

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

    useEffect(() => {
        try {
            if (token) {
                localStorage.setItem('apexdrive_token', token);
            } else {
                localStorage.removeItem('apexdrive_token');
            }
        } catch (err) {
            console.error('Failed to save token:', err);
        }
    }, [token]);

    // Authentication Handlers (Experiment 7: JWT)
    const login = async (emailOrPhone, password) => {
        // Attempt backend MongoDB authentication with JWT
        const authResponse = await loginAPI(emailOrPhone, password);
        if (authResponse && authResponse.user) {
            setUser(authResponse.user);
            if (authResponse.token) setToken(authResponse.token);
            return authResponse.user;
        }

        // Mock fallback authentication check
        const isAdminUser = emailOrPhone.toLowerCase().includes('admin');
        const loggedInUser = {
            id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
            name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Samruddh Jadhav',
            email: emailOrPhone.includes('@') ? emailOrPhone : 'samruddh.jadhav@ves.ac.in',
            phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98201 45678',
            city: 'Mumbai',
            role: isAdminUser ? 'admin' : 'customer',
            avatar: 'SJ'
        };
        setUser(loggedInUser);
        setToken('simulated_jwt_token_' + Date.now());
        return loggedInUser;
    };

    const signup = async (userData) => {
        // Attempt backend MongoDB registration with JWT
        const authResponse = await signupAPI(userData);
        if (authResponse && authResponse.user) {
            setUser(authResponse.user);
            if (authResponse.token) setToken(authResponse.token);
            return authResponse.user;
        }

        // Fallback user creation
        const isAdminUser = userData.email?.toLowerCase().includes('admin') || userData.role === 'admin';
        const newUser = {
            id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
            name: userData.fullName || 'Samruddh Jadhav',
            email: userData.email,
            phone: userData.phone && userData.phone.startsWith('+91') ? userData.phone : `+91 ${userData.phone || '98201 45678'}`,
            city: userData.city || 'Mumbai',
            role: isAdminUser ? 'admin' : 'customer',
            avatar: userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'IN'
        };
        setUser(newUser);
        setToken('simulated_jwt_token_' + Date.now());
        return newUser;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('apexdrive_token');
        localStorage.removeItem('apexdrive_user');
    };

    // Toggle Role helper for Lab Examiners / Testing
    const toggleAdminMode = () => {
        if (!user) return;
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        const updated = { ...user, role: newRole };
        setUser(updated);
        localStorage.setItem('apexdrive_user', JSON.stringify(updated));
    };

    // Booking Handlers (Experiment 4 & 6 CRUD)
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

    const updateBookingStatus = async (bookingId, status) => {
        await updateBookingStatusAPI(bookingId, status);
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    };

    const cancelBooking = (bookingId) => {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    };

    // Fleet Inventory CRUD Handlers (Experiment 6: MongoDB)
    const addCar = async (carData) => {
        const created = await createCarAPI(carData);
        if (created) {
            setFleet(prev => [...prev, created]);
            return created;
        }
        // Fallback
        const fallbackCar = {
            id: fleet.length > 0 ? Math.max(...fleet.map(c => c.id)) + 1 : 1,
            rating: 5.0,
            reviews: 0,
            available: true,
            ...carData
        };
        setFleet(prev => [...prev, fallbackCar]);
        return fallbackCar;
    };

    const updateCar = async (carId, updates) => {
        await updateCarAPI(carId, updates);
        setFleet(prev => prev.map(c => c.id === carId ? { ...c, ...updates } : c));
    };

    const deleteCar = async (carId) => {
        await deleteCarAPI(carId);
        setFleet(prev => prev.filter(c => c.id !== carId));
    };

    return (
        <CarContext.Provider value={{ 
            fleet, 
            setFleet, 
            loading, 
            setLoading,
            bookings,
            addBooking,
            updateBookingStatus,
            cancelBooking,
            addCar,
            updateCar,
            deleteCar,
            user,
            token,
            isAdmin: user?.role === 'admin',
            login,
            signup,
            logout,
            toggleAdminMode
        }}>
            {children}
        </CarContext.Provider>
    );
};