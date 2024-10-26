import AccomodationConfirmation from '@/components/user/AccomodationConfirmation';
import Carousal from '@/components/user/Carousal';
import RegistrationForm from '@/components/user/RegistrationForm';
import React from 'react';

export default function page() {
    return (
        <div className='dark:bg-white'>
            <Carousal />

            <RegistrationForm />
        </div>
    );
}
