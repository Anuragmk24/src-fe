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
    // const [debouncedSearch] = useDebouncedValue(search, 300); // Debo    unce the search input by 300ms

    // Fetch bookings with pagination and token
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
            // Filter for unique users by group
            // const uniqueGroups: any = {};
            // data.participants.forEach((booking: any) => {
            //     const groupId = booking.groupMmebers[0]?.groupId;
            //     if (!uniqueGroups[groupId]) {
            //         uniqueGroups[groupId] = booking; // Save the first user of the group
            //     }
            // });
            // Apply sorting
            const sortedRecords = sortBy(filteredRecords);
            setRecords(Object.values(sortedRecords));
        }
    }, [data, search, sortStatus]);

    console.log('records from participants page', records);
    if (isLoading) {
        return <Loader size="xl" />;
    }

    if (isError) {
        return <div>Error fetching bookings.</div>;
    }

    const handleResendEmail = async (row: any) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to resend the email?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, resend it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // If user confirms, call the resendEmail function
                const response: any = await resendEmail(token, {
                    name: row.firstName,
                    email: row.email,
                    transactionId: row?.groupMmebers?.[0]?.group?.Payment?.[0]?.transactionId,
                });
                if (response.success) {
                    toast.success('Email resent successfully!');
                } else {
                    toast.error('Failed to resend email.');
                }
            }
        });
    };
    console.log('records ', records);

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
                                    {/* {`${record.firstName} ${record.lastName}`} */}
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
                        // {
                        //     accessor: 'regFee',
                        //     title: 'Reg',
                        //     sortable: true,
                        //     render: (record: any) => {
                        //         const paymentStatus = record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus;
                        //         const memberType = record?.memberType;
                        //         const createdAt = new Date(record?.createdAt); // Parse the record creation date
                        //         const changeDate = new Date('2024-11-21 06:02:21.629'); // Date for fee change
                        //         let feeDisplay = null;

                        //         console.log('record', record);

                        //         // Determine the registration fee display based on conditions
                        //         if (paymentStatus === 'SUCCESS') {
                        //             if (memberType === 'IIA_MEMBER') {
                        //                 if (createdAt >= changeDate) {
                        //                     // After the change date
                        //                     feeDisplay = record.isBringingSpouse ? '9000 (Spouse)' : record.groupSize * 4500;
                        //                 } else {
                        //                     // Before the change date
                        //                     feeDisplay = record.isBringingSpouse ? '7000 (with Spouse)' : record.groupSize * 3500;
                        //                 }
                        //             } else if (memberType === 'NON_IIA_MEMBER') {
                        //                 if (createdAt >= changeDate) {
                        //                     // After the change date
                        //                     feeDisplay = record.groupSize * 5000;
                        //                 } else {
                        //                     // Before the change date
                        //                     feeDisplay = record.groupSize * 4500;
                        //                 }
                        //             } else if (memberType === 'STUDENT') {
                        //                 if (createdAt >= changeDate) {
                        //                     // After the change date (assuming no change for students)
                        //                     feeDisplay = record.groupSize * 1500;
                        //                     if (record.isStudentAffiliatedToIia) {
                        //                         feeDisplay = record.groupSize * 1000;
                        //                     }
                        //                 } else {
                        //                     // Before the change date
                        //                     feeDisplay = record.groupSize * 1500;
                        //                     if (record.isStudentAffiliatedToIia) {
                        //                         feeDisplay = record.groupSize * 1000;
                        //                     }
                        //                 }
                        //             }
                        //         }

                        //         return (
                        //             <div className="text-center">
                        //                 {feeDisplay || '---'} {/* Show fee or '---' if not applicable */}
                        //                 {feeDisplay && <RegistrationModal users={record?.groupMmebers?.[0]?.group?.GroupMember} spouse={record?.spouse} />}
                        //             </div>
                        //         );
                        //     },
                        // },

                        // {
                        //     accessor: 'accommodation',
                        //     title: 'Acc',
                        //     sortable: true,
                        //     render: (record: any) => <RenderAccomodation record={record} />,
                        // },
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

                        // {
                        //     accessor: 'transactionId',
                        //     title: 'Transactin ID',
                        //     sortable: true,
                        //     render: (record: any) => record?.groupMmebers?.[0]?.group?.Payment?.[0]?.transactionId ?? '---',
                        // },

                        // {
                        //     accessor: 'paymentStatus',
                        //     title: 'Payment Status',
                        //     sortable: true,
                        //     render: (record: any) => record?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus ?? 'Payment not initiated',
                        // },
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
                        // {
                        //     accessor: '',
                        //     title: 'Resend Email',
                        //     sortable: true,
                        //     render: (row: any) => (
                        //         <h1 className="cursor-pointer" onClick={() => handleResendEmail(row)}>
                        //             {'Send'}
                        //         </h1>
                        //     ),
                        // },
                        {
                            accessor: '',
                            title: 'File',
                            sortable: true,
                            render: (row: any) => <ImageViewModal row={row} />,
                        },

                        // {
                        //     accessor: 'action',
                        //     title: 'Action',
                        //     render: (record) => (
                        //         <div className="cursor-pointer">
                        //             <Modal record={record} />
                        //         </div>
                        //     ),
                        // },
                    ]}
                    totalRecords={data?.participants?.length}
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

    // Define the date when the new rates came into effect
    const changeDate = new Date('2024-11-21 06:02:21.629');
    const createdAt = new Date(record.createdAt);

    // Determine the accommodation fee based on conditions
    let accommodationFee: any = '---';
    if (accomodationPayment.length > 0) {
        if (record.memberType === 'IIA_MEMBER') {
            accommodationFee = createdAt >= changeDate ? (record.isBringingSpouse ? '9000 (Spouse)' : record.groupSize * 4500) : record.isBringingSpouse ? '8000 (Spouse)' : record.groupSize * 4000;
        } else if (record.memberType === 'NON_IIA_MEMBER') {
            accommodationFee = createdAt >= changeDate ? record.groupSize * 5000 : record.groupSize * 4500;
        } else if (record.memberType === 'STUDENT') {
            accommodationFee = record.groupSize * 1500; // Assuming no change for students
            if (record.isStudentAffiliatedToIia) {
                accommodationFee = record.groupSize * 1000;
            }
        }
    }

    return (
        <div className="text-center">
            {accomodationPayment.length > 0 ? (
                <>
                    <p>{accommodationFee}</p>
                    <AccomodationModal users={record?.groupMmebers?.[0]?.group?.GroupMember} spouse={record?.spouse} />
                </>
            ) : (
                <p className="ms-10">---</p>
            )}
        </div>
    );
};
