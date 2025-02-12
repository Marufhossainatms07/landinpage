import React from 'react';
import './TestimonialCard.css'; // Create this CSS file next

const TestimonialCard = ({ clientName, company, quote, clientImageSrc }) => {
    return (
        <div className="testimonial-card">
            {clientImageSrc && <img src={clientImageSrc} alt={clientName} className="client-image"/>}
            <blockquote className="testimonial-quote">
                <p>"{quote}"</p>
            </blockquote>
            <div className="testimonial-author">
                <p className="author-name">{clientName}</p>
                <p className="author-company">{company}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;