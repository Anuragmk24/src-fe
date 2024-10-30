import AttendeeTable from '@/components/admin/AttendeeTable';
import Dropdown from '@/components/dropdown';
import IconBox from '@/components/icon/icon-box';
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes';
import IconEye from '@/components/icon/icon-eye';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots'; // Ensure this is imported
import IconInfoTriangle from '@/components/icon/icon-info-triangle';
import IconTrendingUp from '@/components/icon/icon-trending-up';
import IconUsers from '@/components/icon/icon-users';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import CountDetails from './CountDetails';
import BreadCrumbs from '@/components/BreadCrumbs';

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return (
        <>
            <CountDetails />
            {/* <div className='my-4'>

            <BreadCrumbs title1='Dashbord' title2='Registration'/>
            </div> */}
            <AttendeeTable />
        </>
    );
};

export default Sales;
