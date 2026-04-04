import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-[#fcfaf5] min-h-screen py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <ShieldCheck className="w-16 h-16 text-[#f7941d] mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-[#8b1818] uppercase tracking-wide mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* CONTENT SECTION (Extracted from Document) */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-orange-50 text-gray-700 leading-relaxed space-y-8">
          
          <div>
            <p className="text-lg font-medium mb-2">We believe in transparency.</p>
            <p>At Arpan Cart, your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-[#8b1818] mb-4 border-b border-orange-100 pb-2">SECTION 1 - What do we do with your information?</h2>
            <p className="mb-3">When you purchase something from our store, as part of the buying and selling process, we collect personal information such as your name, address, phone number, and email address.</p>
            <p className="mb-3">When you browse our website, we also automatically receive your device’s Internet Protocol (IP) address to help us understand your browser and operating system for a better user experience.</p>
            <p>With your permission, we may send you updates about our products, services, offers, and important notifications.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#8b1818] mb-4 border-b border-orange-100 pb-2">SECTION 2 - Consent</h2>
            <h3 className="font-bold mb-2">How do we get your consent?</h3>
            <p className="mb-3">When you provide personal information to complete a transaction, place an order, arrange delivery, or return a purchase, we assume that you consent to our collecting and using it for that specific purpose. For marketing purposes, we will either ask for your explicit consent or provide you with an option to opt out.</p>
            <h3 className="font-bold mb-2">How do you withdraw your consent?</h3>
            <p>If you change your mind after opting in, you may withdraw your consent at any time by contacting us at: <strong className="text-[#f7941d]">arpancartofficial@gmail.com</strong></p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#8b1818] mb-4 border-b border-orange-100 pb-2">SECTION 3 & 4 - Disclosure & Payment</h2>
            <p className="mb-4">We may disclose your personal information if required by law or if you violate our Terms of Service.</p>
            <p className="mb-2">We use secure third-party payment gateways such as Razorpay for processing payments. Please note:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your payment data is encrypted through PCI-DSS standards.</li>
              <li>We do not store your card details on our servers.</li>
              <li>Your transaction data is used only for completing your purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#8b1818] mb-4 border-b border-orange-100 pb-2">SECTION 5 - Third-Party Services</h2>
            <p>We may use third-party services to operate our business (such as payment gateways, delivery partners, etc.). These providers will only collect and use your information as necessary to perform their services. Once you leave our website or are redirected to a third-party platform, this Privacy Policy no longer applies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#8b1818] mb-4 border-b border-orange-100 pb-2">SECTION 6 & 7 - Security & Cookies</h2>
            <p className="mb-4">We take reasonable precautions and follow industry best practices to ensure that your personal information is secure and protected from unauthorized access, misuse, or disclosure.</p>
            <p>We use cookies to maintain your session and improve your browsing experience. These cookies do not personally identify you on other websites.</p>
          </section>

          <section className="bg-orange-50 p-6 rounded-xl border border-orange-100 mt-8">
            <h2 className="text-xl font-bold text-[#8b1818] mb-4">Questions & Contact Information</h2>
            <p className="mb-4">If you would like to access, update, or delete your personal information, register a complaint, or need more info, contact us at:</p>
            <p className="font-bold flex flex-col gap-2">
              <span>Email: <a href="mailto:arpancartofficial@gmail.com" className="text-[#f7941d]">arpancartofficial@gmail.com</a></span>
              <span>Address: Patna, Bihar, India</span>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;