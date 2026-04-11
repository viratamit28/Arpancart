import React from 'react';
import { Scale, ChevronRight } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12 overflow-hidden">
      
      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
        `}
      </style>

      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16 animate-fade-up">
          <Scale className="w-16 h-16 text-[#f7941d] mx-auto mb-6 drop-shadow-sm" />
          <h1 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] uppercase tracking-wide mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
        </div>

        {/* CONTENT SECTION (Sharp Corporate Box) */}
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-orange-50 text-gray-700 leading-relaxed space-y-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="border-l-4 border-[#f7941d] pl-5 bg-orange-50/30 py-4 pr-4 rounded-r-sm">
            <p className="font-medium">
              Welcome to Arpan Cart. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making any purchase.
            </p>
          </div>

          <section className="group">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#f7941d] group-hover:translate-x-1 transition-transform" /> 1. General Overview
            </h2>
            <p className="ml-7 text-gray-600 font-medium">
              This website is operated by Arpan Cart. Throughout the site, the terms "we", "us" and "our" refer to Arpan Cart. We offer this website, including all information, tools, and services available to you, the user, conditioned upon your acceptance of all terms stated here.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#f7941d] group-hover:translate-x-1 transition-transform" /> 2. Products & Pricing
            </h2>
            <ul className="ml-7 list-disc pl-5 space-y-2 text-gray-600 font-medium marker:text-[#f7941d]">
              <li>All products (Pooja Samagri, Idols, etc.) are subject to availability.</li>
              <li>We reserve the right to modify or discontinue any product without notice.</li>
              <li>Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, or suspension.</li>
              <li>Images are for representation purposes only. Actual product packaging may vary slightly.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#f7941d] group-hover:translate-x-1 transition-transform" /> 3. Shipping & Delivery
            </h2>
            <p className="ml-7 text-gray-600 font-medium mb-3">
              We strive to deliver your holy essentials as fast as possible. For orders within Patna, we offer ultra-fast delivery. For other regions, standard courier timelines apply. Arpan Cart is not responsible for delays caused by extreme weather, strikes, or third-party courier issues.
            </p>
          </section>

          <section className="group">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[#f7941d] group-hover:translate-x-1 transition-transform" /> 4. User Account & Security
            </h2>
            <p className="ml-7 text-gray-600 font-medium">
              If you create an account on Arpan Cart, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to terminate accounts, refuse service, or cancel orders at our sole discretion.
            </p>
          </section>

          <section className="bg-[#fffbf4] p-6 rounded-sm border border-orange-100 mt-8">
            <h2 className="text-lg font-extrabold text-[#8b1818] mb-3 uppercase tracking-wide">Contact For Legal Inquiries</h2>
            <p className="text-gray-600 font-medium">If you have any questions about the Terms of Service, please contact us at:</p>
            <a href="mailto:aarpancart@gmail.com" className="text-[#f7941d] font-bold hover:text-[#8b1818] transition-colors mt-2 inline-block">
              aarpancart@gmail.com
            </a>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;