// app/payment/result/page.tsx
'use client';
import { verifyResponse } from '@/data/users/register';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

const ResponseScreen = () => {
    const searchParams = useSearchParams();
    const transactionId = searchParams?.get('transaction_id');

    const { data, isLoading, error } = useQuery({
        queryKey: ['verify-payment'],
        queryFn: () => verifyResponse(transactionId),
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-purple-100">
            <div className="text-center p-10 rounded-lg shadow-lg bg-white max-w-xl w-full">
                {data?.paymentStatus === 'SUCCESS' ? (
                    <>
                        {/* Success Icon */}
                        <div className="mx-auto mb-6 p-6 bg-green-200 rounded-full w-32 h-32 flex items-center justify-center shadow-lg animate-bounce">
                            <svg className="w-16 h-16 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4m0 0l-2 2m0 0L9 12m0 0L7 10m6 0l2 2m0 0l2 2" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
                        <p className="text-lg text-gray-700 mb-6">Your payment has been processed successfully. Thank you for completing your transaction.</p>
                        <div className="mb-6">
                            <p className="text-lg text-gray-700">A confirmation QR code has been sent to your email</p>
                            {/* <p className="text-md text-gray-700">Save this reference id for accomodation booking</p> */}
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg mb-6">
                            <p className="text-lg font-semibold text-green-700">
                                <span className="font-bold">Reference ID:</span> {transactionId}
                            </p>
                        </div>

                        {/* Confirmation Message */}

                        {/* QR Code Placeholder */}

                        {/* Action Button */}
                        <a href="/" className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition duration-300">
                            Go to Register
                        </a>
                    </>
                ) : data?.paymentStatus === 'FAILED' ? (
                    <>
                        {/* Failure Icon */}
                        <div className="mx-auto mb-6 p-6 bg-red-200 rounded-full w-32 h-32 flex items-center justify-center shadow-lg animate-pulse">
                            <svg className="w-16 h-16 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Failed</h1>
                        <p className="text-lg text-gray-700 mb-6">Unfortunately, your payment could not be processed. Please try again or contact support.</p>
                        <p className="mb-6">Phone: +91 9632587412</p>
                        {/* <div className="bg-red-100 p-4 rounded-lg mb-6">
                            <p className="text-lg font-semibold text-red-700">
                                <span className="font-bold">Transaction ID:</span> {transactionId}
                            </p>
                        </div> */}
                        <a href="/" className="inline-block px-6 py-3 mt-4 text-lg font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition duration-300">
                            Try Again
                        </a>
                    </>
                ) : (
                    <>
                        {/* Icon for Pending Status */}
                        <div className="mx-auto mb-6 p-6 bg-yellow-100 rounded-full w-32 h-32 flex items-center justify-center shadow-lg animate-bounce">
                            <svg className="w-16 h-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                            </svg>
                        </div>

                        {/* Main Message */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-center">Payment Pending</h1>

                        {/* Additional Details */}
                        <p className="text-md md:text-lg text-gray-600 mb-6 text-center max-w-lg mx-auto">Your payment is currently pending. For assistance, feel free to contact our support team.</p>

                        {/* Contact Information */}
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-md mb-6 text-center">
                            <p className="text-gray-700 font-semibold">
                                <span className="font-bold">Contact Support:</span> +91 9632587412
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center">
                            <a href="/" className="px-8 py-3 text-lg font-medium text-white bg-yellow-500 rounded-full shadow hover:bg-yellow-600 transition duration-300 ease-in-out">
                                Try Again
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResponseScreen;
