import React from 'react';

function Carousal() {
    return (
        <div className="relative">
            {/* Image */}
            <div className="relative">
                <img
                    src="/assets/images/intro-bg.jpg"
                    className="w-full h-44 md:h-[100vh] object-cover  overflow-hidden relative before:absolute before:inset-0 before:bg-[rgba(22,81,91,0.9)]  "
                    alt="Carousal"
                />
                
                {/* Overlay with Fade Effect */}
                <div
                    className="absolute " // Semi-transparent overlay
                    // style={{ backdropFilter: 'blur(5px)' }} // Optional: adds blur to the background
                />
            </div>

            {/* Centered Text */}
            {/* <h2 className="absolute inset-0 flex items-center justify-center text-white text-xl md:text-3xl font-bold">
                Register Now
            </h2> */}
        </div>
    );
}

export default Carousal;
