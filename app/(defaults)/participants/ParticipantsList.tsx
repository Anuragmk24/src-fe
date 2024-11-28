'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { fetchBookings, fetchParticipants } from '@/data/admin/registration';
import { formatDate } from '@/utils/common';

import { resendEmail } from '@/data/admin/dashbord';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import AccomodationModal from '@/components/admin/AccomodationModal';
import ImageViewModal from '@/components/admin/ImageViewModal';
import GroupModal from '@/components/admin/GroupModal';
import RegistrationModal from '@/components/admin/RegistrationModal';
import ExcelExort from '@/components/admin/ExcelExort';
import Modal from '@/components/admin/Modal';
import { Loader } from '@mantine/core';

const ParticipantsList = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const { token } = useSelector((state: any) => state.admin);
    const [accomodationdetails, setAccomodationdetails] = useState<any>();
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'date',
        direction: 'asc',
    });
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['bookings', page, pageSize],
        queryFn: () => fetchParticipants(token, (page - 1) * pageSize, pageSize, search),
        // keepPreviousData: true, // Keeps previous data while fetching new page data
    });

    console.log('data from participants ', data);

    const [records, setRecords] = useState<any[]>([]);
    useEffect(() => {
        if (search !== '') {
            refetch(); // Refetch when there is a search term
        }
    }, [search, refetch]);
    useEffect(() => {
        if (data?.participants) {
            let filteredRecords = data.participants;

            const sortedRecords = sortBy(filteredRecords);
            setRecords(Object.values(sortedRecords));
        }
    }, [data, search, sortStatus]);

    if (isLoading) {
        return <Loader size="xl" />;
    }

    if (isError) {
        return <div>Error fetching bookings.</div>;
    }

    return (
        <div className="sm:panel mt-6">
            <div className="mb-5 flex flex-col sm:gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Participants Details</h5>
                <div className="ltr:ml-auto rtl:mr-auto flex gap-x-3">
                    {/* <ExcelExort /> */}
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className={`${isRtl ? 'table-hover whitespace-nowrap' : 'table-hover whitespace-nowrap'}`}
                    records={records}
                    columns={[
                        {
                            accessor: 'firstName',
                            title: 'Name',
                            sortable: true,
                            render: (record) => (
                                <>
                                    <Modal refetch={refetch} firstName={record.firstName} lastName={record?.lastName} record={record} />
                                </>
                            ),
                        },
                        { accessor: 'mobile', title: 'Phone', sortable: true },

                        { accessor: 'createdAt', title: 'Date', sortable: true, render: (record: any) => formatDate(record.createdAt) },
                        {
                            accessor: 'memberType',
                            title: 'Member Type',
                            sortable: true,
                            render: (record: any) => <div>{record.memberType === 'IIA_MEMBER' ? 'IIA Member' : record.memberType === 'NON_IIA_MEMBER' ? 'Non IIA Member' : 'Student'}</div>,
                        },
                        {
                            accessor: 'center',
                            title: 'Centre',
                            sortable: true,
                            render: (row: any) => (row.center ? row.center : '---'),
                        },
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: (row: any) => (row.state ? row.state : '---'),
                        },

                        {
                            accessor: 'iia',
                            title: 'IIA',
                            sortable: true,
                            render: (record: any) => record?.iia,
                        },
                        {
                            accessor: 'coaNumber',
                            title: 'COA',
                            sortable: true,
                            render: (record: any) => record?.coaNumber,
                        },

                        {
                            accessor: 'designation',
                            title: 'Occupancy',
                            sortable: true,
                            render: (row: any) => (row.designation ? row.designation : '---'),
                        },
                        {
                            accessor: 'collegeName',
                            title: 'College',
                            sortable: true,
                            render: (row: any) => (row.collegeName ? row.collegeName : '---'),
                        },

                        {
                            accessor: '',
                            title: 'File',
                            sortable: true,
                            render: (row: any) => <ImageViewModal row={row} />,
                        },
                    ]}
                    totalRecords={data?.totalParticipants}
                    recordsPerPage={pageSize}
                    page={page}
                    onPageChange={setPage}
                    recordsPerPageOptions={PAGE_SIZES}
                    onRecordsPerPageChange={setPageSize}
                    sortStatus={sortStatus}
                    onSortStatusChange={setSortStatus}
                    minHeight={200}
                    paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                />
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default ParticipantsList;
