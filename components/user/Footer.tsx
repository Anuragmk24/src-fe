import Link from 'next/link';
import React from 'react';

function Footer() {
    return (
        <div className="relative">
            {/* Background image */}
            <img className="w-full h-60 sm:h-auto" src="/assets/images/footerImg.jpg" alt="Footer Background" />

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center space-y-6">
                <div className="grid grid-cols-2 gap-8 items-center w-full max-w-6xl px-6">
                    {/* Logo and Register Now Button */}
                    <div className="flex sm:gap-8 flex-col  items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <img src="/assets/images/logoIcon.svg" alt="Logo" className="w-20 h-16 md:w-60" />
                        <button className="text-[153A40] bg-[#E5E52E]  text-sm sm:text-2xl px-4 py-3 rounded-md hover:bg-[#E5E52E]">Register Now</button>
                    </div>

                    {/* Contact Information */}
                    <div className="flex flex-col  items-center text-center text-white">
                        <h1 className="font-bold text-2xl sm:text-3xl">Contact Us</h1>
                        <h3 className="font-bold">Vythiri Village Resort, Wayanad</h3>
                        <h3 className="font-bold">+91 22 2204 6972</h3>
                        <h3 className="font-bold">+91 22 2288 4805</h3>
                    </div>
                </div>
            </div>
            <div className="py-8 bg-[#38AE88] font-medium text-center text-white">
                <h3>© Copyright SRC events All Rights Reserved </h3>
            </div>
        </div>
    );
}

export default Footer;
