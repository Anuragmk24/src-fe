'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, fetchChaptersData } from '@/data/admin/registration';
import { Loader } from '@mantine/core';
import toast, { Toaster } from 'react-hot-toast';
import CenterModal from './CenterModal';

const ChaptersTable = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const { token } = useSelector((state: any) => state.admin);
    const [accomodationdetails, setAccomodationdetails] = useState<any>();
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [modalOpen, setModalOpen] = useState('');
    const [search, setSearch] = useState('');
    const [modal10, setModal10] = useState(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'date',
        direction: 'asc',
    });
    // const [debouncedSearch] = useDebouncedValue(search, 300); // Debo    unce the search input by 300ms

    // Fetch bookings with pagination and token
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['bookings', page, pageSize],
        queryFn: () => fetchChaptersData(token, (page - 1) * pageSize, pageSize, search),
        // keepPreviousData: true, // Keeps previous data while fetching new page data
    });

    const [records, setRecords] = useState<any[]>([]);
    useEffect(() => {
        if (search !== '') {
            refetch(); // Refetch when there is a search term
        }
    }, [search, refetch]);
    useEffect(() => {
        if (data?.data.length > 0) {
            setRecords(data?.data);
        }
    }, [data]);

    if (isLoading) {
        return <Loader size="xl" />;
    }

    if (isError) {
        return <div>Error fetching bookings.</div>;
    }

    return (
        <div className="sm:panel mt-6">
            <div className="mb-5 flex flex-col sm:gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Chapter Details</h5>
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
                        {
                            accessor: 'state',
                            title: 'State',
                            sortable: true,
                            render: (row: any) => (
                                <h1
                                    className="cursor-pointer"
                                    onClick={() => {
                                        setModalOpen(row?.state); // Set the state for the selected row
                                        setModal10(true); // Open the modal
                                    }}
                                >
                                    {row?.state}
                                </h1>
                            ),
                        },
                        {
                            accessor: 'count',
                            title: 'Count',
                            sortable: true,
                            render: (row: any) => (row?.count ? row?.count : '---'),
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
            <Toaster position="bottom-right" />
            {modalOpen !== '' && <CenterModal state={modalOpen} setModal10={setModal10} modal10={modal10} />}
        </div>
    );
};

export default ChaptersTable;
