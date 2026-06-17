import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'https://arpancart-production.up.railway.app/api'; 

  useEffect(() => {
    const fetchTodayBanner = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/carousel/today`);
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          
          let parsedUrls = [];
          if (data.imageUrl) {
            try {
              const parsed = JSON.parse(data.imageUrl);
              if (Array.isArray(parsed)) {
                parsedUrls = parsed;
              } else if (typeof parsed === 'string') {
                parsedUrls = [parsed]; 
              } else {
                parsedUrls = [data.imageUrl];
              }
            } catch (e) {
              parsedUrls = data.imageUrl.includes(',') ? data.imageUrl.split(',') : [data.imageUrl];
            }
          }
          
          const cleanUrls = parsedUrls
            .map(url => typeof url === 'string' ? url.trim().replace(/^["']|["']$/g, '') : '')
            .filter(url => url !== '');

          if (cleanUrls.length > 0) {
            setImages(cleanUrls);
          } else {
            setImages(["https://placehold.co/1920x1080/fff9eb/8b1818?text=ArpanCart+Premium+Banner"]);
          }
        }
      } catch (error) {
        console.error("Carousel fetch error", error);
        setImages(["https://placehold.co/1920x1080/fff9eb/8b1818?text=ArpanCart+Premium+Banner"]);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayBanner();
  }, []);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [images.length]);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 1.5s ease-in-out forwards; }
        `}
      </style>

      {/* Container Heights */}
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[480px] xl:h-[550px] bg-[#fff9eb] overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8b1818] z-30 pointer-events-none"></div>
        <div className="absolute top-1.5 left-0 w-full h-0.5 bg-[#f7941d] z-30 opacity-70 pointer-events-none"></div>

        {loading ? (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#fff9eb] z-10 animate-fade-in">
            <Loader2 className="w-12 h-12 text-[#8b1818] animate-spin mb-3" />
            <p className="text-sm font-bold text-[#8b1818]/70 uppercase tracking-widest">Loading Today's Darshan...</p>
          </div>
        ) : (
          <Link 
            to="/shop" 
            className="absolute inset-0 w-full h-full z-10 block overflow-hidden group bg-black/5"
            title="Click to explore"
          >
            <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none transition-colors duration-500 group-hover:bg-transparent"></div>
            
            {images.map((url, index) => (
              <div 
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Blurred Background (Phone ke liye kaam aayega) */}
                <img 
                  src={url} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110" 
                />
                
                {/* 🔥 FIX: Mobile pe 'object-contain', Desktop (md aur upar) pe 'object-cover' 🔥 */}
                <img 
                  src={url} 
                  alt={`Today Special ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-contain md:object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" 
                />
              </div>
            ))}
          </Link>
        )}

        {!loading && images.length > 1 && (
          <div className="absolute bottom-4 sm:bottom-6 left-0 w-full flex justify-center gap-2 z-30 pointer-events-none">
            {images.map((_, index) => (
              <div 
                key={index} 
                className={`transition-all duration-500 rounded-full ${
                  index === currentIndex 
                    ? 'w-6 h-2 md:w-8 bg-[#f7941d] shadow-[0_0_10px_rgba(247,148,29,0.8)]' 
                    : 'w-2 h-2 bg-white/70'
                }`}
              ></div>
            ))}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none"></div>

      </div>
    </>
  );
};

export default Hero;