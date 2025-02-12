// src/components/Navbar.jsx
import { useEffect, useState, useRef } from 'react';
import './Navbar.css';
import logoImage from '../assets/logo.png';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
      const navbar = navbarRef.current;

      const handleScroll = () => {
          if (navbar) {
              const rect = navbar.getBoundingClientRect();
              setIsSticky(rect.top <= 0);
          }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);

  const navbarClasses = `navbar ${isSticky ? 'sticky' : ''}`;

    return (
        <header className={navbarClasses} ref={navbarRef}>
            <div className="navbar-logo">
                <img src={logoImage} alt="Classic Bikers Logo" />
                <a href="/">Classic Bikers</a>
            </div>
        </header>
    );
};

export default Navbar;