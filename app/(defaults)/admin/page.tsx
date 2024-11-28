'use client'
import AttendeeTable from '@/components/admin/AttendeeTable';
import { Metadata } from 'next';
import React from 'react';
import CountDetails from './CountDetails';
import { useQuery } from '@tanstack/react-query';
import { fetchDashbordDataCounts } from '@/data/admin/dashbord';
import { useSelector } from 'react-redux';

// export const metadata: Metadata = {
//     title: 'Sales Admin',
// };

const Sales = () => {
    const { token } = useSelector((state: any) => state.admin);

    const { data, isError, isLoading,refetch } = useQuery({
        queryKey: ['total-counts'],
        queryFn: () => fetchDashbordDataCounts(token),
    });
    return (
        <>
            <CountDetails data={data} />

            <AttendeeTable refetchFn={refetch} />
        </>
    );
};

export default Sales;
