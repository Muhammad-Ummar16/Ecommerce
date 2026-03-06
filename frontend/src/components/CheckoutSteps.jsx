import React from 'react';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3 }) => {
    return (
        <div className="flex justify-center items-center mb-16 gap-4 md:gap-8">
            <Step item="Sign In" active={step1} />
            <div className={`h-[2px] w-8 md:w-16 ${step2 ? 'bg-[#3D3028]' : 'bg-gray-200'}`} />
            <Step item="Shipping" active={step2} />
            <div className={`h-[2px] w-8 md:w-16 ${step3 ? 'bg-[#3D3028]' : 'bg-gray-200'}`} />
            <Step item="Place Order" active={step3} />
        </div>
    );
};

const Step = ({ item, active }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${active
                ? 'bg-[#3D3028] border-[#3D3028] text-white'
                : 'bg-white border-gray-200 text-gray-300'
            }`}>
            {active ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-[#3D3028]' : 'text-gray-300'}`}>
            {item}
        </span>
    </div>
);

export default CheckoutSteps;
