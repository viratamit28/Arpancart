import React from 'react';
import { Leaf, ShieldCheck, Heart, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* =========================================
            HEADER SECTION (Premium Decor)
        ========================================= */}
        <div className="text-center mb-16 mt-4">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:flex items-center">
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8b1818] px-6 text-center tracking-wide uppercase">
              About Arpancart
            </h1>

            <div className="hidden md:flex items-center">
              <div className="w-1.5 h-1.5 bg-[#8b1818] transform rotate-45 mx-1.5 opacity-60"></div>
              <div className="w-12 lg:w-24 h-[1px] bg-[#8b1818] opacity-40"></div>
            </div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-center font-medium text-lg">
            Bringing purity, authenticity, and peace to your daily spiritual practices.
          </p>
        </div>

        {/* =========================================
            OUR STORY SECTION (Split Layout)
        ========================================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
          {/* Left Side: Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-[#f7941d] rounded-2xl transform translate-x-4 translate-y-4 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1590400612999-566b6e4e5b4b?q=80&w=800&auto=format&fit=crop" 
              alt="Pooja Ritual" 
              className="relative w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-lg border-2 border-white"
            />
          </div>

          {/* Right Side: Text Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#8b1818] mb-4">Our Spiritual Journey</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Arpancart started with a simple belief: every prayer deserves the purest ingredients. In today's fast-paced world, finding authentic and unadulterated pooja samagri has become difficult. We set out to change that.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We travel across India to source the finest natural herbs, pure cow ghee, and eco-friendly incense directly from artisans and farmers. Our mission is to deliver the sacred temple-like experience right to your home, ensuring your focus remains solely on your devotion.
            </p>
            <div className="pt-4">
              <p className="text-[#f7941d] font-extrabold text-xl font-serif italic">
                "Purity in Samagri, Peace in Prarthana."
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            OUR CORE VALUES (Grid Section)
        ========================================= */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#8b1818] mb-12">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f7941d] transition-colors duration-300">
                <Leaf className="w-8 h-8 text-[#f7941d] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">100% Natural</h3>
              <p className="text-gray-600">Chemical-free agarbattis and pure ingredients sourced directly from nature.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f7941d] transition-colors duration-300">
                <ShieldCheck className="w-8 h-8 text-[#f7941d] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Assured Purity</h3>
              <p className="text-gray-600">Every product undergoes strict quality checks to maintain religious sanctity.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f7941d] transition-colors duration-300">
                <Heart className="w-8 h-8 text-[#f7941d] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Made with Love</h3>
              <p className="text-gray-600">Handcrafted by traditional artisans, supporting local communities across India.</p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#f7941d] transition-colors duration-300">
                <Users className="w-8 h-8 text-[#f7941d] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Customer First</h3>
              <p className="text-gray-600">Dedicated support to ensure your spiritual needs are always met on time.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;