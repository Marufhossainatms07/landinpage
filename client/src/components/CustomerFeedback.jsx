// src/components/LandingPage/CustomerFeedback.jsx
import React, { useRef, useState, useEffect } from 'react';
import './CustomerFeedback.css';

const CustomerFeedback = ({ feedbackList }) => {
    const feedbackContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [velocityX, setVelocityX] = useState(0);
    const [lastMoveTime, setLastMoveTime] = useState(0);
    const inertiaDuration = 500;

    const [dragReady, setDragReady] = useState(false); // New state to track drag readiness
    const dragDelay = 150; // Delay in milliseconds before drag starts - adjust as needed
    let dragStartTimer = null;

    useEffect(() => {
        let animationFrameID;

        const inertiaScroll = () => {
            if (!feedbackContainerRef.current) return;

            feedbackContainerRef.current.scrollLeft += velocityX;
            setVelocityX(prevVelocityX => prevVelocityX * 0.62);

            if (Math.abs(velocityX) > 0.1) {
                animationFrameID = requestAnimationFrame(inertiaScroll);
            } else {
                setVelocityX(0);
            }
        };

        if (!isDragging && velocityX !== 0) {
            animationFrameID = requestAnimationFrame(inertiaScroll);
        }

        return () => cancelAnimationFrame(animationFrameID);
    }, [isDragging, velocityX]);

    const handleMouseDown = (e) => {
        dragStartTimer = setTimeout(() => { // Start timer on mouse down
            setDragReady(true); // Set dragReady to true after delay
            setIsDragging(true); // Now set isDragging to true as well, starting drag
            feedbackContainerRef.current.classList.add('dragging');
        }, dragDelay); // Delay before drag is considered 'ready'

        setStartX(e.pageX - feedbackContainerRef.current.offsetLeft);
        setScrollLeft(feedbackContainerRef.current.scrollLeft);
        setVelocityX(0);
    };


    const handleMouseLeave = () => {
        clearTimeout(dragStartTimer); // Clear timer if mouse leaves before delay
        setDragReady(false); // Reset dragReady
        setIsDragging(false);
        feedbackContainerRef.current.classList.remove('dragging');
        startMomentumScroll();
    };

    const handleMouseUp = () => {
        clearTimeout(dragStartTimer); // Clear timer if mouse is released before delay
        setDragReady(false); // Reset dragReady
        setIsDragging(false);
        feedbackContainerRef.current.classList.remove('dragging');
        startMomentumScroll();
    };

    const handleMouseMove = (e) => {
        if (!dragReady) return; // **Important: Only proceed if drag is ready (after delay)**
        if (!isDragging) return; // Still check if isDragging is true (should be now)

        e.preventDefault();
        const currentTime = Date.now();
        const elapsed = currentTime - lastMoveTime;
        const x = e.pageX - feedbackContainerRef.current.offsetLeft;
        const walk = Math.round(x - startX);
        const currentVelocityX = elapsed > 0 ? walk / elapsed : 0;

        setVelocityX(currentVelocityX);
        setLastMoveTime(currentTime);
        feedbackContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const startMomentumScroll = () => {
        if (Math.abs(velocityX) > 0.1) {
            // Inertia scroll will be handled by the useEffect hook
        }
    };

    return (
        <section className="customer-feedback-section">
            <h2>Customer Feedback</h2>
            <div
                className="feedback-container"
                ref={feedbackContainerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {feedbackList.map((feedback, index) => (
                    <div key={index} className="feedback-item">
                        <div className="feedback-avatar">
                            <img src={feedback.avatarUrl} alt={feedback.author} />
                        </div>
                        <div className="feedback-message-content">
                            <div className="feedback-author">{feedback.author}</div>
                            <div className="feedback-comment">"{feedback.comment}"</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CustomerFeedback;