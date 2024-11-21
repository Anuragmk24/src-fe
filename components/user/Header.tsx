'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Rajdhani } from '@next/font/google';

// Load the font with specific weights
const rajdhani = Rajdhani({
    subsets: ['latin'], // Choose your subsets here
    weight: ['400', '700'], // Choose weights if needed
});
function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-[#29C192] shadow-md md:px-20">
            <div className={`${rajdhani.className} font-semibold container mx-auto px-4 md:py-2 flex justify-between items-center`}>
                {/* Logo */}
                <div className="text-2xl font-semibold">
                    <img src="/assets/images/logoIcon.svg" alt="Logo" className="w-20 h-16 md:w-44 md:h-20" />
                </div>

                {/* Navbar Links - Hidden on Mobile */}
                <div className="hidden  md:flex space-x-8 items-center">
                    <Link href="https://src2024.in/index.html" className="text-white font-semibold ellow-400">
                        Home
                    </Link>
                    <Link href="https://src2024.in/about_us.html" className="text-white font-semibold hover:text-yellow-400">
                        About The Event
                    </Link>

                    <Link href="https://src2024.in/index.html?section=#committee" className="text-white font-semibold hover:text-yellow-400">
                        Committee
                    </Link>
                    <Link href="#footer" className="text-white font-semibold hover:text-yellow-400">
                        Contact Us
                    </Link>
                    <Link href="/" className="bg-[#E5E52E] font-mono text-[#16616E] font-semibold px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                        Register Now
                    </Link>
                    {/* <Link href="/add-accomodation" className="bg-[#E5E52E] font-mono text-[#16616E] font-semibold px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                        Accomodation
                    </Link> */}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white font-semibold focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className={`${rajdhani.className} space-y-2 px-2 pt-2 pb-3`}>
                        <Link href="https://src2024.in/index.html" className="block text-white font-semibold hover:text-yellow-400">
                            Home
                        </Link>
                        <Link href="https://src2024.in/about_us.html" className="block text-white font-semibold ">
                            About The Event
                        </Link>

                        <Link href="https://src2024.in/index.html?section=#committee" className="block text-white font-semibold ">
                            Committee
                        </Link>
                        <Link href="#footer" className="block text-white font-semibold ">
                            Contact Us
                        </Link>
                        <Link href="/" className="block  text-white font-semibold bg-[#E5E52E] px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                            Register Now
                        </Link>
                        {/* <Link href="/add-accomodation" className="block  text-white font-semibold bg-[#E5E52E] px-4 py-2 rounded-md hover:bg-[#E5E52E]">
                            Accomodation
                        </Link> */}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Header;
