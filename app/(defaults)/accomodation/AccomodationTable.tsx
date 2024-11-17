'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { fetchBookings } from '@/data/admin/registration';
import { Loader } from '@mantine/core'; // Assuming you are using Mantine loader
import { formatDate } from '@/utils/common';
import { fetchAccomodationData, resendEmail } from '@/data/admin/dashbord';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import ExcelExort from '@/components/admin/ExcelExort';
import RegistrationModal from '@/components/admin/RegistrationModal';
import GroupModal from '@/components/admin/GroupModal';
import Modal from '@/components/admin/Modal';
import AccomodationModal from '@/components/admin/AccomodationModal';

const AccomodationTable = () => {
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
    // const [debouncedSearch] = useDebouncedValue(search, 300); // Debo    unce the search input by 300ms

    // Fetch bookings with pagination and token
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['accomodation', page, pageSize],
        queryFn: () => fetchAccomodationData(token, (page - 1) * pageSize, pageSize, search),
        // keepPreviousData: true, // Keeps previous data while fetching new page data
    });

    const [records, setRecords] = useState<any[]>([]);
    useEffect(() => {
        if (search !== '') {
            refetch(); // Refetch when there is a search term
        }
    }, [search, refetch]);
    useEffect(() => {
        if (data?.data?.accommodation) {
            let filteredRecords = data.data.bookings;
            // Filter for unique users by group
            const uniqueGroups: any = {};
            data.data.accommodation.forEach((booking: any) => {
                const groupId = booking.groupMmebers[0]?.groupId;
                if (!uniqueGroups[groupId]) {
                    uniqueGroups[groupId] = booking; // Save the first user of the group
                }
            });
            // Apply sorting
            const sortedRecords = sortBy(Object.values(uniqueGroups), (record: any) => -new Date(record.createdAt).getTime());
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
                <h5 className="text-lg font-semibold dark:text-white-light">Accomodation Details</h5>
                <div className="ltr:ml-auto rtl:mr-auto flex gap-x-3">
                    {/* <ExcelExort/> */}
                    <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

                    {/* <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className={`${isRtl ? 'table-hover whitespace-nowrap' : 'table-hover whitespace-nowrap'}`}
                    records={records}
                    columns={[
                        { accessor: 'firstName', title: 'Name', sortable: true, render: (record) => `${record.firstName} ${record.lastName}` },
                        { accessor: 'mobile', title: 'Phone', sortable: true },

                        { accessor: 'createdAt', title: 'Date', sortable: true, render: (record: any) => formatDate(record.createdAt) },

                        {
                            accessor: 'memberType',
                            title: 'Member Type',
                            sortable: true,
                            render: (row: any) => (row.memberType === 'IIA_MEMBER' ? 'IIA' : row.memberType === 'NON_IIA_MEMBER' ? 'Non IIA' : 'Student'),
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
                            accessor: 'accommodation',
                            title: 'Acc AMT',
                            sortable: true,
                            render: (record: any) => <RenderAccomodation record={record} />,
                        },
                        // {
                        //     accessor: 'total',
                        //     title: 'Total',
                        //     sortable: true,
                        //     render: (record: any) => {
                        //         // const paymentStatus = record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus;
                        //         // console.log("paymentstatus =======> ",paymentStatus)
                        //         const successfulPayments = record.groupMmebers?.flatMap((member: any) => member.group?.Payment?.filter((payment: any) => payment.paymentStatus === 'SUCCESS') || []);
                        //         const amount = successfulPayments
                        //             ?.filter((payment: any) => payment.paymentStatus === 'SUCCESS')
                        //             .reduce((sum: any, payment: any) => Number(sum) + Number(payment.amount), 0);
                        //         const formattedAmount = amount.toLocaleString();

                        //         const numberOfMembers = record?.groupMmebers?.[0]?.group?.numberOfMembers;

                        //         const groupLabel = numberOfMembers > 1 ? ' (Group)' : '';
                        //         return (
                        //             <div className="flex justify-center flex-col items-center">
                        //                 <span>{`${formattedAmount}${groupLabel}`}</span>
                        //                 <GroupModal users={record?.groupMmebers?.[0]?.group?.GroupMember} spouse={record?.spouse} />
                        //             </div>
                        //         );
                        //     },
                        // },

                        {
                            accessor: 'transactionId',
                            title: 'Transactin ID',
                            sortable: true,
                            render: (record: any) => record?.groupMmebers?.[0]?.group?.Payment?.[0]?.transactionId ?? '---',
                        },

                        {
                            accessor: 'paymentStatus',
                            title: 'Payment Status',
                            sortable: true,
                            render: (record: any) => record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus ?? 'Payment not initiated',
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
        </div>
    );
};

export default AccomodationTable;

const RenderAccomodation = ({ record }: { record: any }) => {
    const [accomodationdetails, setAccomodationdetails] = useState<any[]>([]);

    useEffect(() => {
        // Check for BOTH and ACCOMODATION types and add them if they exist
        const successfulPayments = record.groupMmebers?.flatMap((member: any) => member.group?.Payment?.filter((payment: any) => payment.paymentStatus === 'SUCCESS') || []);
        const accomodationExists = successfulPayments?.filter((item: any) => item.type === 'BOTH');
        const accomodationExits2 = successfulPayments?.filter((item: any) => item.type === 'ACCOMMODATION');

        // Combine both arrays and update state without re-adding existing items
        if (accomodationExists?.length > 0 || accomodationExits2?.length > 0) {
            setAccomodationdetails([...accomodationExists, ...accomodationExits2]);
        }
    }, [record]);

    // Filter out only successful payments
    const accomodationPayment = accomodationdetails.filter((item: any) => item.paymentStatus === 'SUCCESS');

    return (
        <div className="text-center">
            {accomodationPayment.length > 0 ? (
                <>
                    <p>{record.isBringingSpouse ? '8000' : record.memberType === 'IIA_MEMBER' ? record.groupSize * 4000 : record.memberType === 'NON_IIA_MEMBER' ? record.groupSize * 4500 : null}</p>
                    <AccomodationModal users={record?.groupMmebers?.[0]?.group?.GroupMember} spouse={record?.spouse} />
                </>
            ) : (
                <p className="ms-10">---</p>
            )}
        </div>
    );
};
