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

        // Verified Preconfigured Accounts: 1 Admin + 2 Customers
        const verifiedAccounts = [
            {
                id: 'USR-ADMIN-01',
                name: 'ApexDrive Administrator',
                email: 'admin@apexdrive.in',
                phone: '+91 98200 00000',
                city: 'Mumbai',
                password: 'Admin@123',
                role: 'admin',
                avatar: 'AD'
            },
            {
                id: 'USR-CUST-01',
                name: 'Rahul Sharma',
                email: 'rahul.sharma@gmail.com',
                phone: '+91 98201 12345',
                city: 'Mumbai',
                password: 'Customer@123',
                role: 'customer',
                avatar: 'RS'
            },
            {
                id: 'USR-CUST-02',
                name: 'Priya Patel',
                email: 'priya.patel@gmail.com',
                phone: '+91 98202 67890',
                city: 'Bengaluru',
                password: 'Customer@456',
                role: 'customer',
                avatar: 'PP'
            }
        ];

        const trimmedInput = emailOrPhone.trim().toLowerCase();
        const matched = verifiedAccounts.find(
            u => (u.email.toLowerCase() === trimmedInput || u.phone === emailOrPhone.trim()) && u.password === password
        );

        if (matched) {
            const { password: _, ...safeUser } = matched;
            setUser(safeUser);
            setToken('simulated_jwt_token_' + Date.now());
            return safeUser;
        }

        // Check locally registered accounts in session
        try {
            const registered = JSON.parse(localStorage.getItem('apexdrive_registered_users') || '[]');
            const found = registered.find(
                u => (u.email.toLowerCase() === trimmedInput || u.phone === emailOrPhone.trim()) && u.password === password
            );
            if (found) {
                const { password: _, ...safeUser } = found;
                setUser(safeUser);
                setToken('simulated_jwt_token_' + Date.now());
                return safeUser;
            }
        } catch {
            // ignore
        }

        throw new Error('Invalid email or password. Please check your credentials.');
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
        const isAdminUser = userData.role === 'admin' || userData.email?.toLowerCase() === 'admin@apexdrive.in';
        const newUser = {
            id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
            name: userData.fullName || 'Registered User',
            email: userData.email,
            phone: userData.phone && userData.phone.startsWith('+91') ? userData.phone : `+91 ${userData.phone || '98201 00000'}`,
            city: userData.city || 'Mumbai',
            role: isAdminUser ? 'admin' : 'customer',
            avatar: userData.fullName ? userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'CU'
        };

        // Cache registered user in localStorage
        try {
            const registered = JSON.parse(localStorage.getItem('apexdrive_registered_users') || '[]');
            registered.push({ ...newUser, password: userData.password });
            localStorage.setItem('apexdrive_registered_users', JSON.stringify(registered));
        } catch {
            // ignore
        }

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
            logout
        }}>
            {children}
        </CarContext.Provider>
    );
};