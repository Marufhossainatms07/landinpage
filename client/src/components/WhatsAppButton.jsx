// src/components/LandingPage/WhatsAppButton.jsx

import './WhatsAppButton.css'; // Create CSS file for button styles
import whatsappIcon from '../assets/whatsappicon.png';
import { useState } from 'react'; // Import useState

const WhatsAppButton = ({ phoneNumber, message }) => {
  const whatsappLink = `https://wa.me/${phoneNumber}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // State for tooltip visibility

  const handleMouseEnter = () => {
    setIsTooltipVisible(true); // Show tooltip on mouse enter
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false); // Hide tooltip on mouse leave
  };

  return (
    <div className="whatsapp-button-container">
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-button" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        aria-label="Contact us on WhatsApp">
        <img src={whatsappIcon} alt="WhatsApp" className="whatsapp-icon" />
        {/* Contact us on WhatsApp */}
      </a>
      {isTooltipVisible && ( // Conditionally render tooltip
        <div className="whatsapp-tooltip">
          Need help? Chat with us on WhatsApp!
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;