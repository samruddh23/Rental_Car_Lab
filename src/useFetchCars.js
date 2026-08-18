import { useEffect, useContext } from 'react';
import { CarContext } from './CarContext';

export const useFetchCars = () => {
    const { setFleet, setLoading } = useContext(CarContext);

    useEffect(() => {
        // Simulating an API call to a backend database with a timeout
        const fetchVehicleData = async () => {
            setLoading(true);
            
            // Mock data representing the rental database inventory with rich details
            const mockData = [
                { 
                    id: 1, 
                    make: 'Porsche', 
                    model: '911 Carrera S', 
                    type: 'Sports Convertible', 
                    category: 'sports',
                    price: 180,
                    rating: 4.95,
                    reviews: 184,
                    transmission: 'Automatic',
                    passengers: 4,
                    fuel: 'Premium Gas',
                    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
                },
                { 
                    id: 2, 
                    make: 'Tesla', 
                    model: 'Model Y Long Range', 
                    type: 'Electric Crossover', 
                    category: 'electric',
                    price: 95,
                    rating: 4.88,
                    reviews: 215,
                    transmission: 'Automatic',
                    passengers: 5,
                    fuel: 'Electric',
                    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800'
                },
                { 
                    id: 3, 
                    make: 'Range Rover', 
                    model: 'Sport Luxury', 
                    type: 'Luxury SUV', 
                    category: 'suv',
                    price: 140,
                    rating: 4.91,
                    reviews: 98,
                    transmission: 'Automatic',
                    passengers: 7,
                    fuel: 'Mild Hybrid',
                    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
                },
                { 
                    id: 4, 
                    make: 'Mercedes-Benz', 
                    model: 'C-Class AMG Line', 
                    type: 'Premium Sedan', 
                    category: 'sedan',
                    price: 75,
                    rating: 4.82,
                    reviews: 142,
                    transmission: 'Automatic',
                    passengers: 5,
                    fuel: 'Gasoline',
                    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800'
                },
                { 
                    id: 5, 
                    make: 'Ford', 
                    model: 'Bronco Wildtrak', 
                    type: 'Off-Road SUV', 
                    category: 'suv',
                    price: 110,
                    rating: 4.87,
                    reviews: 73,
                    transmission: 'Automatic',
                    passengers: 5,
                    fuel: 'Gasoline',
                    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
                },
                { 
                    id: 6, 
                    make: 'Audi', 
                    model: 'e-tron GT', 
                    type: 'Electric Sports Sedan', 
                    category: 'electric',
                    price: 220,
                    rating: 4.97,
                    reviews: 54,
                    transmission: 'Automatic',
                    passengers: 4,
                    fuel: 'Electric',
                    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'
                }
            ];

            setTimeout(() => {
                setFleet(mockData);
                setLoading(false);
            }, 1000); // 1-second delay to simulate network request
        };

        fetchVehicleData();
    }, [setFleet, setLoading]);
};