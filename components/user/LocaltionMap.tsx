import React from 'react';

function LocationMap() {
    return (
        <div className="h-full">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15635.607966408626!2d76.0425493!3d11.5588834!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba67396e38131bb%3A0xaedce1f74a99f29f!2sVythiri%20Village%20Resort!5e0!3m2!1sen!2sin!4v1728537145627!5m2!1sen!2sin"
                width="100%" // Update this
                height="100%" // Or adjust height based on design
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    );
}

export default LocationMap;
