'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings } from '@/data/admin/registration';
import { Loader } from '@mantine/core'; // Assuming you are using Mantine loader
import { formatDate } from '@/utils/common';

const AccomodationTable = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const { token } = useSelector((state: any) => state.residencyAdmin);

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    // Fetch bookings with pagination and token
    const { data, isLoading, isError } = useQuery({
        queryKey: ['bookings', page, pageSize],
        queryFn: () => fetchBookings(token, (page - 1) * pageSize, pageSize),
        // keepPreviousData: true, // Keeps previous data while fetching new page data
    });

    const [records, setRecords] = useState<any[]>([]);

    // Set records and apply sorting/filtering
    useEffect(() => {
        if (data?.data?.bookings) {
            let filteredRecords = data.data.bookings;

            // Apply search filter
            if (search) {
                filteredRecords = filteredRecords.filter(
                    (item: any) =>
                        item.firstName.toLowerCase().includes(search.toLowerCase()) ||
                        item.lastName.toLowerCase().includes(search.toLowerCase()) ||
                        item.email.toLowerCase().includes(search.toLowerCase()) ||
                        item.mobile.toLowerCase().includes(search.toLowerCase()) ||
                        item.memberType.toLowerCase().includes(search.toLowerCase()) ||
                        item.payments[0].transactionId.toLowerCase().includes(search.toLowerCase()) ||
                        item.payments[0].paymentStatus.toLowerCase().includes(search.toLowerCase())
                );
            }

            // Apply sorting
            const sortedRecords = sortBy(filteredRecords, sortStatus.columnAccessor);
            setRecords(sortStatus.direction === 'desc' ? sortedRecords.reverse() : sortedRecords);
        }
    }, [data, search, sortStatus]);

    if (isLoading) {
        return <Loader size="xl" />;
    }

    if (isError) {
        return <div>Error fetching bookings.</div>;
    }

    const handleAction = (id: any) => {};

    console.log('RECORDS ============> ', records);
    return (
        <div className="panel mt-6">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Order Sorting</h5>
                <div className="ltr:ml-auto rtl:mr-auto">
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className={`${isRtl ? 'table-hover whitespace-nowrap' : 'table-hover whitespace-nowrap'}`}
                    records={records}
                    columns={[
                        { accessor: 'firstName', title: 'Name', sortable: true, render: (record) => `${record.firstName} ${record.lastName}` },
                        { accessor: 'createdAt', title: 'Date', sortable: true, render: (record: any) => formatDate(record.createdAt) },
                        { accessor: 'mobile', title: 'Phone No.', sortable: true },
                        {
                            accessor: 'mobile',
                            title: 'Member Type',
                            sortable: true,
                            render: (record: any) => <div>{record.memberType === 'IIA_MEMBER' ? 'IIA Member' : record.memberType === 'NON_IIA_MEMBER' ? 'Non IIA Member' : 'Student'}</div>,
                        },
                        {
                            accessor: 'regfee',
                            title: 'Reg. fee',
                            sortable: true,
                            render: (record: any) => {
                                return record.memberType === 'IIA_MEMBER' ? '3500' : record.memberType === 'NON_IIA_MEMBER' ? '4500' : record.isStudentAffiliatedToIia ? '1000' : '1500';
                            },
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

                        { accessor: 'accPrice', title: 'Accomodoation Price', sortable: true, render: (record: any) => 4000 },
                        { accessor: 'paymentAmount', title: 'Payment Amount', sortable: true, render: (record: any) => 3500 },
                        {
                            accessor: 'paymentStatus',
                            title: 'Payment Status',
                            sortable: true,
                            render: (record: any) => (record?.payments?.length > 0 ? record?.payments?.[0]?.paymentStatus : 'Payment not initiated'),
                        },
                        {
                            accessor: 'transactionId',
                            title: 'Transactin ID',
                            sortable: true,
                            render: (record: any) => (record?.payments?.length > 0 ? record?.payments?.[0]?.transactionId : '---'),
                        },
                       
                    ]}
                    totalRecords={data?.data?.totalCount}
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
        </div>
    );
};

export default AccomodationTable;
