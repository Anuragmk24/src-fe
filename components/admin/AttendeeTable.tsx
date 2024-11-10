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
import IconEye from '../icon/icon-eye';
import Modal from './Modal';
import AccomodationModal from './AccomodationModal';
import RegistrationModal from './RegistrationModal';
import GroupModal from './GroupModal';

const AttendeeTable = () => {
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
    // const [debouncedSearch] = useDebouncedValue(search, 300); // Debounce the search input by 300ms

    // Fetch bookings with pagination and token
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['bookings', page, pageSize],
        queryFn: () => fetchBookings(token, (page - 1) * pageSize, pageSize, search),
        // keepPreviousData: true, // Keeps previous data while fetching new page data
    });

    const [records, setRecords] = useState<any[]>([]);
    useEffect(() => {
        if (search !== '') {
            refetch(); // Refetch when there is a search term
        }
    }, [search, refetch]);
    useEffect(() => {
        if (data?.data?.bookings) {
            let filteredRecords = data.data.bookings;
            // Filter for unique users by group
            const uniqueGroups: any = {};
            data.data.bookings.forEach((booking: any) => {
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
                <h5 className="text-lg font-semibold dark:text-white-light">Registration Details</h5>
                <div className="ltr:ml-auto rtl:mr-auto">
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
                            accessor: 'regFee',
                            title: 'Reg',
                            sortable: true,
                            render: (record: any) => {
                                const paymentStatus = record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus;
                                const memberType = record?.memberType;
                                let feeDisplay = null;

                                // Determine the registration fee display based on conditions
                                if (paymentStatus === 'SUCCESS') {
                                    if (memberType === 'IIA_MEMBER') {
                                        feeDisplay = record.isBringingSpouse ? '7000 (with Spouse)' : record.groupSize * 3500;
                                    } else if (memberType === 'NON_IIA_MEMBER') {
                                        feeDisplay = record.groupSize * 4500;
                                    }
                                }

                                return (
                                    <div className="text-center">
                                        {feeDisplay || '---'} {/* Show fee or '---' if not applicable */}
                                        {feeDisplay && <RegistrationModal users={record?.groupMmebers?.[0]?.group?.GroupMember} spouse={record?.spouse} />}
                                    </div>
                                );
                            },
                        },

                        {
                            accessor: 'accommodation',
                            title: 'Acc',
                            sortable: true,
                            render: (record: any) => <RenderAccomodation record={record} />,
                        },
                        {
                            accessor: 'total',
                            title: 'Total',
                            sortable: true,
                            render: (record: any) => {
                                // const paymentStatus = record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus;
                                // console.log("paymentstatus =======> ",paymentStatus)
                                const successfulPayments = record.groupMmebers?.flatMap((member: any) => member.group?.Payment?.filter((payment: any) => payment.paymentStatus === 'SUCCESS') || []);
                                const amount = successfulPayments
                                    ?.filter((payment: any) => payment.paymentStatus === 'SUCCESS')
                                    .reduce((sum: any, payment: any) => Number(sum) + Number(payment.amount), 0);
                                const formattedAmount = amount.toLocaleString();

                                const numberOfMembers = record?.groupMmebers?.[0]?.group?.numberOfMembers;

                         
                                const groupLabel = numberOfMembers > 1 ? ' (Group)' : '';
                                return (

                                    <div className='flex justify-center flex-col items-center'>
                                    <span>{`${formattedAmount}${groupLabel}`}</span>
                                    <GroupModal
                                      users={record?.groupMmebers?.[0]?.group?.GroupMember}
                                      spouse={record?.spouse}
                                    />
                                  </div>                                )
                           
                            },
                        },

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
                            accessor: 'action',
                            title: 'Action',
                            render: (record) => (
                                <div className="cursor-pointer">
                                    <Modal record={record} />
                                </div>
                            ),
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

export default AttendeeTable;

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
