'use client'
import AccomodationConfirmation from '@/components/user/AccomodationConfirmation';
import Carousal from '@/components/user/Carousal';
import RegistrationForm from '@/components/user/RegistrationForm';
import React from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { SlCalender } from 'react-icons/sl';
import { Rajdhani } from '@next/font/google';

// Load the font with specific weights
const rajdhani = Rajdhani({
    subsets: ['latin'], // Choose your subsets here
    weight: ['400', '700'], // Choose weights if needed
});

export default function Page() {
    return (
        <div className="dark:bg-white">
            <div className="relative">
                {/* Image with Overlay */}
                <div className="relative w-full h-[450px] md:h-[100vh] overflow-hidden">
                    <img src="/assets/images/intro-bg.jpg" className="w-full h-full object-cover" alt="Carousal" />
                    <div className="absolute inset-0 bg-[rgba(22,81,91,0.9)]"></div>

                    {/* Intro Container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        <div className="bnr-logo mb-2">
                            <img className="w-10 sm:w-full" src="/assets/sponsors/jidal-sml-logo.svg" alt="Jidal Logo" />
                        </div>
                        <div className="bnr-logo mb-2 w-2/3 sm:w-1/3">
                            <img src="/assets/images/logoIcon.svg" className="w-full" alt="SRC Banner Logo" />
                        </div>
                        <div className="mb-4">
                            <img className="w-10 sm:w-full" src="/assets/sponsors/White_Simpolo_Logo.svg" alt="Simpolo Logo" />
                        </div>
                        <div className={`${rajdhani.className} font-medium flex flex-col sm:flex-row gap-2 items-center justify-center gap-x-4 text-[#16616E] sm:text-xl mb-8`}>
                            <div className="flex items-center gap-x-2">
                                <SlCalender className="text-yellow-300" />
                                <h3 className="text-white font-bold">29, 30 NOVEMBER 2024</h3>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <CiLocationOn className="text-yellow-300" />
                                <h3 className="text-white font-bold">Vythiri Village Resort, Wayanad</h3>
                            </div>
                        </div>
                        <h1
                            style={{
                                backgroundColor: '#FCD34D', // equivalent to bg-yellow-300
                                color: '#16616E',
                                fontWeight: 'bold',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                animation: 'colorChange 1.5s linear infinite',
                                margin:'10px'
                            }}
                        >
                            Please note that our double rooms are fully booked. We currently have availability only in triple and quadruple rooms. If additional rooms become available, this will be
                            updated on the website.
                        </h1>
                    </div>
                </div>

                {/* Color Change Animation */}
                <style jsx>{`
                    @keyframes colorChange {
                        0% { color: #16616E; }        /* Original color */
                        20% { color: #FFA500; }       /* Orange */
                        40% { color: #FF4500; }       /* Red */
                        60% { color: #32CD32; }       /* Lime Green */
                        80% { color: #1E90FF; }       /* Dodger Blue */
                        100% { color: #16616E; }      /* Back to original */
                    }
                `}</style>

                {/* Registration Form */}
                <RegistrationForm />
            </div>
        </div>
    );
}
