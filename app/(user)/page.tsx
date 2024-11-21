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
            {/* <Carousal /> */}
            <div className="relative">
                {/* Image with Overlay */}
                <div className="relative w-full h-72 md:h-[100vh] overflow-hidden">
                    <img src="/assets/images/intro-bg.jpg" className="w-full h-full object-cover" alt="Carousal" />
                    <div className="absolute inset-0 bg-[rgba(22,81,91,0.9)]"></div>

                    {/* Intro Container */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                        {/* <div className="bnr-logo mb-2">
                            <img className='w-10 sm:w-full'  src="/assets/sponsors/jidal-sml-logo.svg" alt="Jidal Logo" />
                        </div>
                        <div className="bnr-logo  mb-2 w-2/3 sm:w-1/3">
                            <img src="/assets/images/logoIcon.svg" className="w-full" alt="SRC Banner Logo" />
                        </div> */}
                        <div className="mb-4">
                            <img className='w-10 sm:w-full' src="/assets/sponsors/logoWithSponsors.svg" alt="Simpolo Logo" />
                        </div>
                        <div className={`${rajdhani.className} font-medium flex flex-col sm:flex-row gap-2 items-center justify-center  gap-x-4 text-[#16616E] sm:text-xl mb-8`}>
                            <div className="flex items-center gap-x-2">
                                <SlCalender className="text-yellow-300" />
                                <h3 className="text-white font-bold">29, 30 NOVEMBER 2024</h3>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <CiLocationOn className="text-yellow-300" />
                                <h3 className="text-white font-bold">Vythiri Village Resort, Wayanad</h3>
                            </div>
                        </div>
                        {/* <a href="#definition" className={`${rajdhani.className} mt-4 bg-[#E5E52E] hover:bg-[#E5E52E]  text-[#16616E] font-semibold px-4 py-2 rounded-md`}>
                            Register Now
                        </a> */}
                    </div>
                </div>

                {/* Registration Form */}
                <RegistrationForm />
            </div>
        </div>
    );
}
