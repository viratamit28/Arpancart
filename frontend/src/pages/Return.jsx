import React from 'react';
import { RefreshCcw, AlertTriangle, ShieldCheck, CreditCard } from 'lucide-react';

const Return = () => {
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
          <RefreshCcw className="w-16 h-16 text-[#f7941d] mx-auto mb-6 drop-shadow-sm" />
          <h1 className="text-3xl md:text-[40px] font-extrabold text-[#8b1818] uppercase tracking-wide mb-4">
            Return & Refund Policy
          </h1>
          <p className="text-gray-600 font-medium text-lg">Your satisfaction and spiritual peace are our top priorities.</p>
        </div>

        {/* CONTENT SECTION (Sharp Corporate Box) */}
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-orange-50 text-gray-700 leading-relaxed space-y-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          <p className="font-medium text-lg border-b border-gray-100 pb-6">
            Given the sacred nature of our products, we have a strict but fair return policy to ensure purity and hygiene are maintained for all our customers.
          </p>

          {/* Policy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Eligibility */}
            <div className="bg-[#fffbf4] p-6 rounded-sm border border-orange-100 hover:border-[#f7941d] transition-colors">
              <ShieldCheck className="w-8 h-8 text-[#8b1818] mb-4" />
              <h3 className="text-lg font-extrabold text-gray-800 mb-2 uppercase tracking-wide">Return Eligibility</h3>
              <p className="text-sm font-medium text-gray-600">
                Returns are accepted within <strong className="text-[#8b1818]">3 days</strong> of delivery. Items must be unused, in original packaging, and with all seals intact. 
              </p>
            </div>

            {/* Refunds */}
            <div className="bg-[#fffbf4] p-6 rounded-sm border border-orange-100 hover:border-[#f7941d] transition-colors">
              <CreditCard className="w-8 h-8 text-[#8b1818] mb-4" />
              <h3 className="text-lg font-extrabold text-gray-800 mb-2 uppercase tracking-wide">Refund Process</h3>
              <p className="text-sm font-medium text-gray-600">
                Once your return is inspected and approved, a refund will be processed to your original payment method within <strong className="text-[#8b1818]">5-7 business days</strong>.
              </p>
            </div>

          </div>

          {/* Exceptions Section */}
          <section>
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-6 uppercase tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#f7941d]" /> Non-Returnable Items
            </h2>
            <div className="bg-red-50/50 p-6 rounded-sm border-l-4 border-red-500">
              <p className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">The following items cannot be returned or exchanged:</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 font-medium text-sm marker:text-red-500">
                <li>Fresh Flowers, Leaves, and perishable items.</li>
                <li>Edible Prasad and sweets.</li>
                <li>Opened packages of Agarbatti, Dhoop, Kumkum, or Haldi.</li>
                <li>Customized or Bulk Pooja Kits.</li>
              </ul>
            </div>
          </section>

          {/* Damaged Goods */}
          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide">Damaged or Defective Items</h2>
            <p className="text-gray-600 font-medium mb-4">
              If you receive a damaged Idol, Brass item, or broken packaging, please contact us within <strong className="text-[#c21820]">24 hours</strong> of delivery.
            </p>
            <p className="bg-gray-50 p-4 rounded-sm border border-gray-200 text-sm font-bold text-gray-700 italic">
              Pro Tip: We highly recommend taking a continuous unboxing video of your package to ensure a smooth and quick replacement process.
            </p>
          </section>

          {/* Cancellations */}
          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-extrabold text-[#8b1818] mb-4 uppercase tracking-wide">Order Cancellations</h2>
            <p className="text-gray-600 font-medium">
              Orders can only be cancelled before they are dispatched. Once an order is handed over to our delivery executive, it cannot be cancelled. For customized kits, cancellations must be made within 2 hours of placing the order.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Return;