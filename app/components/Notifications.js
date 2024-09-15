'use client'
import { useEffect } from 'react'

const Notification = ({ message, type, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onClose(), 3000); 
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <div
            className={`fixed top-5 right-5 z-50 transition-all duration-500 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
        >
            {message && (
                <div className={`p-3 rounded-md shadow-md ${type === 'success' ? 'bg-[#3c5df0]' : 'bg-[#e02020]'} text-white text-base`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Notification;
