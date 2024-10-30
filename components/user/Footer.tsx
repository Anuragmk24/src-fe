import Link from 'next/link';
import React from 'react';
import { CiLocationOn } from 'react-icons/ci';

function Footer() {
    return (
        <>
            <div id='footer' className="relative">
                {/* Background image */}
                <img className="w-full h-[400px] sm:h-96 md:h-[500px] lg:h-[600px] md:object-cover" src="/assets/images/footerImg.jpg" alt="Footer Background" />

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col justify-start md:justify-center items-start md:items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center w-full max-w-6xl px-6">
                        {/* Logo and Register Now Button */}
                        <div className="flex sm:gap-8 sm:flex-col gap-3 mt-2 sm:mt-0 items-center sm:items-center sm:space-y-0 justify-center sm:space-x-4">
                            <img src="/assets/sponsors/jidal-sml-logo.svg" alt="Logo" className="w-14 h-12 md:w-20 md:h-20" />
                            <img src="/assets/images/logoIcon.svg" alt="Logo" className="w-14 h-12 md:w-60" />
                            <button className="text-[153A40] bg-[#E5E52E] text-[12px] md:text-2xl px-2 py-1 sm:px-4 sm:py-3 rounded-md hover:bg-[#E5E52E]">
                                Register Now
                            </button>
                        </div>

                        {/* Contact Information */}
                        <div className="flex flex-col items-center md:items-center text-center text-white space-y-0 sm:space-y-4">
                            <h1 className="font-bold text-sm sm:text-3xl">Contact Us</h1>
                            {/* <div className="font-bold sm:text-base flex items-center gap-x-2 text-[10px]">
                                <CiLocationOn size={20} className="text-yellow-400 text-[10px]" />
                                Vythiri Village Resort, Wayanad
                            </div> */}

                            {/* Contact Sections */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm sm:text-base">
                                {/* Registration Section */}
                                <div className="space-y-2">
                                    <h2 className="font-bold underline text-yellow-400 text-[10px]">Registration</h2>
                                    <div className="flex items-center justify-center gap-x-2 text-[10px] sm:text-sm">
                                        Ar. Amit Kamal
                                    </div>
                                    <p>+91 9511771463</p>
                                </div>

                                {/* Hospitality Section */}
                                <div className="space-y-2">
                                    <h2 className="font-bold underline text-[10px] text-yellow-400 sm:text-sm">Hospitality</h2>
                                    <div className="flex items-center justify-center gap-x-2 text-[10px] sm:text-sm">
                                        Ar. Shyam
                                    </div>
                                    <p>+91 9895404502</p>
                                </div>

                                {/* General Section */}
                                <div className="space-y-2">
                                    <h2 className="font-bold underline text-[10px] text-yellow-400 sm:text-sm">General</h2>
                                    <div className="flex items-center justify-center gap-x-2 text-[10px] sm:text-sm">
                                        Ar. Lookman
                                    </div>
                                    <p>+91 9048614309</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8 bg-[#38AE88] font-medium text-center text-white">
                <h3>© Copyright Southern Regional Conference - 2024. All Rights Reserved</h3>
            </div>
        </>
    );
}

export default Footer;
