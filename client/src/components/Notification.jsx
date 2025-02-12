// frontend/src/components/Notification.jsx
import { useState, useEffect } from 'react';
import './Notification.css'; // We'll create Notification.css next

const Notification = ({ message, type, duration = 3000, onClose }) => { // type can be 'success' or 'error'
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible && message) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose(); // Call onClose callback when notification hides
                }
            }, duration); // Hide notification after duration

            return () => clearTimeout(timer); // Clear timeout on component unmount or message change
        }
    }, [isVisible, message, duration, onClose]);

    useEffect(() => {
        setIsVisible(true); // Show notification whenever message prop changes
    }, [message]);

    if (!isVisible || !message) {
        return null; // Don't render if not visible or no message
    }

    const notificationClass = `notification ${type}`; // e.g., "notification success" or "notification error"

    return (
        <div className={notificationClass}>
            <p>{message}</p>
            <button className="notification-close-button" onClick={() => setIsVisible(false)}>&times;</button>
        </div>
    );
};

export default Notification;