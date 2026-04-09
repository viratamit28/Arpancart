import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollManager = () => {
  const location = useLocation();
  const navType = useNavigationType(); // Ye batata hai action: "PUSH", "POP", ya "REPLACE"

  useEffect(() => {
    // Agar action "POP" nahi hai (yaani user ne Back button NAHI dabaya hai)
    // Toh page ko ekdum top (0,0) par scroll kar do.
    // Agar "POP" (Back) hai, toh browser khud purani jagah par rok lega.
    if (navType !== 'POP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smoothly upar jayega
      });
    }
  }, [location.pathname, navType]);

  return null; // Ye screen par kuch nahi dikhayega, piche kaam karega
};

export default ScrollManager;