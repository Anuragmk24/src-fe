import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchCenters } from '@/data/admin/dashbord';

function CenterModal({ state, setModal10, modal10 }: { state: any; setModal10: any; modal10: any }) {
    const { token } = useSelector((state: any) => state.admin);

    // Use queryKey that reflects state directly
    const { data, isLoading, isError } = useQuery({
        queryKey: ['center', state],
        queryFn: () => fetchCenters(token, state),
        enabled: Boolean(state) && modal10, // Ensure modal10 is open and state is valid
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner-border animate-spin border-t-2 border-blue-500 w-8 h-8 rounded-full"></div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500">Error loading center data.</div>;
    }

    return (
        <div>
            <Transition appear show={modal10} as={Fragment}>
                <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div
                        id="slideIn_down_modal"
                        className="fixed inset-0 bg-gray-800/50 z-[999] overflow-y-auto flex items-center justify-center"
                    >
                        <div className="w-full max-w-lg bg-white dark:bg-[#121c2c] rounded-lg shadow-lg p-6 animate__animated animate__slideInDown">
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <h5 className="font-semibold text-lg text-gray-800 dark:text-white">Centre Details</h5>
                                <button
                                    onClick={() => setModal10(false)}
                                    type="button"
                                    className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                >
                                    <IconX />
                                </button>
                            </div>

                            {/* Display center data */}
                            {data?.data?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.data.map((item: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg dark:bg-[#1a202c] shadow-sm hover:bg-gray-200 dark:hover:bg-[#2d3748]"
                                        >
                                            <h1 className="font-semibold text-gray-800 dark:text-white">{item.center}</h1>
                                            <span className="text-gray-600 dark:text-gray-400">{item.userCount} Users</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-600 dark:text-gray-400">No centers available.</div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setModal10(false)}
                                    type="button"
                                    className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default CenterModal;
