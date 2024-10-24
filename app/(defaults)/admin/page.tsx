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

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return (
        <>
        <div className='grid grid-cols-4 gap-x-3'>

            <div className="panel ">
                <div className="flex justify-between">
                    <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Registration</div>
                    <div className="dropdown">
                    <IconCashBanknotes className="h-6 w-6 text-yellow-500" />
                       
                        {/* <Dropdown offset={[0, 5]} placement={'bottom-end'} btnClassName="hover:opacity-80" button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}>
                            <ul className="text-black dark:text-white-dark">
                                <li>
                                    <button type="button">View Report</button>
                                </li>
                                <li>
                                    <button type="button">Edit Report</button>
                                </li>
                            </ul>
                        </Dropdown> */}
                    </div>
                </div>
                <div className="flex items-center mt-5">
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">56</div>
                </div>
                <div className="flex cursor-pointer items-center font-semibold mt-5">
                    <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                    <Link href="/admin/users">See all Registration</Link>
                </div>
            </div>
            <div className="panel ">
                <div className="flex justify-between">
                    <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Attendees</div>
                    <div className="dropdown">
                    <IconUsers className="h-6 w-6 text-violet-500" />
                    </div>
                </div>
                <div className="flex items-center mt-5">
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">56</div>
                </div>
                <div className="flex cursor-pointer items-center font-semibold mt-5">
                    <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                    <Link href="/admin/users">See all users</Link>
                </div>
            </div>
            <div className="panel ">
                <div className="flex justify-between">
                    <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Payments</div>
                    <div className="dropdown">
                    <IconTrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                </div>
                <div className="flex items-center mt-5">
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">56</div>
                </div>
                <div className="flex cursor-pointer items-center font-semibold mt-5">
                    <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                    <Link href="/admin/users">See all users</Link>
                </div>
            </div>
            <div className="panel ">
                <div className="flex justify-between">
                    <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Payment not processed</div>
                    <div className="dropdown">
                    <IconInfoTriangle className="h-6 w-6 text-orange-500" />

                    </div>
                </div>
                <div className="flex items-center mt-5">
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">56</div>
                </div>
                <div className="flex cursor-pointer items-center font-semibold mt-5">
                    <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                    <Link href="/admin/users">See all users</Link>
                </div>
            </div>
        </div>

            <AttendeeTable />
        </>
    );
};

export default Sales;
