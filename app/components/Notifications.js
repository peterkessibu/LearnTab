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
            className={`fixed z-50 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${
                'bottom-4 left-1/2 transform -translate-x-1/2 w-10/12 sm:w-auto sm:top-5 sm:right-5 sm:left-auto sm:bottom-auto sm:transform-none'
                }`}
        >
            {message && (
                <div
                    className={`p-2 sm:p-3 rounded-md shadow-md ${type === 'success' ? 'bg-[#3c5df0]' : 'bg-[#e02020]'
                        } text-white text-sm sm:text-base max-w-[90vw] sm:max-w-md break-words`}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Notification;
