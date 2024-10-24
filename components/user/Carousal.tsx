import React from 'react';

function Carousal() {
    return (
        <div className="relative">
            {/* Image */}
            <div className="relative">
                <img
                    src="/assets/images/carousal2.jpg"
                    className="w-full h-44 md:h-80 object-cover"
                    alt="Carousal"
                />
                
                {/* Overlay with Fade Effect */}
                <div
                    className="absolute " // Semi-transparent overlay
                    // style={{ backdropFilter: 'blur(5px)' }} // Optional: adds blur to the background
                />
            </div>

            {/* Centered Text */}
            <h2 className="absolute inset-0 flex items-center justify-center text-white text-xl md:text-3xl font-bold">
                Register Now
            </h2>
        </div>
    );
}

export default Carousal;
