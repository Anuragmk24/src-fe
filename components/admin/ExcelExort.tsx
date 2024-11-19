import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';
import { fetchBookings } from '@/data/admin/registration';

function ExcelExort() {
    const { token } = useSelector((state: any) => state.admin);

    const exportWithStyling = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bookings');

        // Add Header Row
        worksheet.addRow(['Name', 'Email', 'Mobile', 'Booking Type', 'Transaction ID', 'Registration Amount', 'Accomodation Amount', 'Total Amount', 'Member Type']);

        // Fetch all data
        const pageSize = 1000; // Fetch 100 rows per request
        let currentPage = 1;
        let hasMoreData = true;
        let allBookings: any[] = [];

        while (hasMoreData) {
            const response = await fetchBookings(token, (currentPage - 1) * pageSize, pageSize, 'SUCCESS');
            console.log('Response from excll ', response);
            if (response && response.data) {
                allBookings = [...allBookings, ...response?.data?.bookings];
                hasMoreData = response.data.length === pageSize; // If less than pageSize, no more data
                currentPage++;
            } else {
                hasMoreData = false; // Stop fetching if API fails
            }
        }

        // Add Data Rows
        allBookings.forEach((booking) => {
            const paymentStatus = booking?.groupMmebers?.[0]?.group?.Payment?.[0]?.paymentStatus;
            const memberType = booking?.memberType;
            let feeDisplay = null;
            if (paymentStatus === 'SUCCESS') {
                if (memberType === 'IIA_MEMBER') {
                    feeDisplay = booking.isBringingSpouse ? 7000 : booking.groupSize * 3500;
                } else if (memberType === 'NON_IIA_MEMBER') {
                    feeDisplay = booking.groupSize * 4500;
                } else if (memberType === 'STUDENT') {
                    feeDisplay = booking.groupSize * 1500;
                    if (booking.isStudentAffiliatedToIia) {
                        feeDisplay = booking.groupSize = 1000;
                    }
                }
            }
            const successfulPayments = booking.groupMmebers?.flatMap((member: any) => member.group?.Payment?.filter((payment: any) => payment.paymentStatus === 'SUCCESS') || []);

            const amount = successfulPayments?.filter((payment: any) => payment.paymentStatus === 'SUCCESS').reduce((sum: any, payment: any) => Number(sum) + Number(payment.amount), 0);
            const formattedAmount = amount.toLocaleString();
            const accomodationAmount = booking.isBringingSpouse
                ? '8000'
                : booking.memberType === 'IIA_MEMBER'
                ? booking.groupSize * 4000
                : booking.memberType === 'NON_IIA_MEMBER'
                ? booking.groupSize * 4500
                : null;
            worksheet.addRow([
                booking.firstName,
                booking.email,
                booking.mobile,
                booking.bookingType,
                booking.groupMmebers?.[0]?.group?.Payment?.[0]?.transactionId,
                feeDisplay,
                accomodationAmount,
                formattedAmount,
                booking.memberType === 'STUDENT' ? 'Student' : booking.memberType === 'IIA_MEMBER' ? 'IIA Member' : 'Non IIA Member',
            ]);
        });

        // Style Header Row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4472C4' },
        };

        // Save the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'BookingsData.xlsx');
    };

    return (
        <div>
            <button onClick={exportWithStyling} type="button" className="btn btn-outline-primary">
                Export
            </button>
        </div>
    );
}

export default ExcelExort;
