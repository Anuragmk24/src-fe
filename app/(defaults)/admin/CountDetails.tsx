'use client';
import Dropdown from '@/components/dropdown';
import IconCashBanknotes from '@/components/icon/icon-cash-banknotes';
import IconEye from '@/components/icon/icon-eye';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInfoTriangle from '@/components/icon/icon-info-triangle';
import IconTrendingUp from '@/components/icon/icon-trending-up';
import IconUsers from '@/components/icon/icon-users';
import { fetchDashbordDataCounts } from '@/data/admin/dashbord';
import { fetchTotalAccomodationCount } from '@/data/users/register';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

function CountDetails() {
    const { token } = useSelector((state: any) => state.admin);

    const { data, isError, isLoading } = useQuery({
        queryKey: ['total-counts'],
        queryFn: () => fetchDashbordDataCounts(token),
    });
    const { data: accomodationCount, isError: accomodationCountError } = useQuery({
        queryKey: ['total-numbers'],
        queryFn: () => fetchTotalAccomodationCount(),
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:grid-cols-4 gap-x-3">
            <div className="panel ">
                <div className="flex justify-between">
                    <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Registration</div>
                    <div className="dropdown">
                        <IconCashBanknotes className="h-6 w-6 text-yellow-500" />
                    </div>
                </div>
                <div className="flex justify-between items-center mt-5">
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.data?.totalRegistrationCount}</div>
                    <div className="dropdown">
                        <Dropdown
                            offset={[0, 5]}
                            placement={`bottom-end`}
                            btnClassName="hover:text-primary"
                            button={<IconHorizontalDots className="text-black/70 hover:!text-primary dark:text-white/70" />}
                        >
                            <ul>
                                <li className='w-full min-w-44'>
                                    <button type="button">Accomodation  : {accomodationCount?.count}</button>
                                </li>
                               
                            </ul>
                        </Dropdown>
                    </div>
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
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.data?.totalAttendeeCount}</div>
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
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.data?.totalPaymentAmount}</div>
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
                    <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{data?.data?.totalpendingPayment}</div>
                </div>
            </div>
        </div>
    );
}

export default CountDetails;
