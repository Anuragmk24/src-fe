import BreadCrumbs from '@/components/BreadCrumbs';
import React from 'react';
import AccomodationTable from './AccomodationTable';

function page() {
    return (
        <div>
            <BreadCrumbs title1="Dashbord" title2="Accomodation" />
            <AccomodationTable/>
        </div>
    );
}

export default page;
