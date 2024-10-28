import IconX from '@/components/icon/icon-x';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import IconEye from '../icon/icon-eye';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toggleAttendeeStatus } from '@/data/admin/registration';

function Modal({ record }: { record: any }) {
    const [modal10, setModal10] = useState(false);
    const [isAttended, setIsAttended] = useState(record?.attended); // assuming record has isAttended field
    const { token } = useSelector((state: any) => state.admin);
    const mutation = useMutation({
        mutationFn: async (newAttendanceStatus:any) => {
            const response:any = await toggleAttendeeStatus(token,record.id)
            return response.data; // Return the response data for further use
        },
        onSuccess: (data) => {
            console.log('Attendance updated:', data);
            // Optionally, you can update the local state if needed
        },
        onError: (error) => {
            console.error('Error updating attendance:', error);
            // Optionally, handle the error (e.g., show a notification)
        },
    });
    const toggleAttendance = () => {
        const newAttendanceStatus = !isAttended; // Calculate new status
        setIsAttended(newAttendanceStatus); // Update local state

        // Trigger the mutation to update the attendance status in the backend
        mutation.mutate(newAttendanceStatus);
    };

    return (
        <div>
            <div onClick={() => setModal10(true)}>
                <IconEye />
            </div>
            <Transition appear show={modal10} as={Fragment}>
                <Dialog as="div" open={modal10} onClose={() => setModal10(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div id="slideIn_down_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__slideInDown">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">User Details</h5>
                                    <button onClick={() => setModal10(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <div className="space-y-2">
                                        <div>
                                            <p>
                                                <strong>First Name:</strong> {record.firstName}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Last Name:</strong> {record.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Email:</strong> {record.email}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Mobile:</strong> {record.mobile}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Company Name:</strong> {record.companyName}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Designation:</strong> {record.designation}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Country:</strong> {record.country}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>State:</strong> {record.state}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>City:</strong> {record.city}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Pin Code:</strong> {record.pinCode}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Booking Type:</strong> {record.bookingType}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Group Size:</strong> {record.groupSize}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Is Bringing Spouse:</strong> {record.isBringingSpouse ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <strong>Member Type:</strong> {record.memberType}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <strong>Status:</strong>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={isAttended} onChange={toggleAttendance} className="sr-only" />
                                                <div className={`w-10 h-4 rounded-full shadow-inner transition duration-300 ease-in-out ${isAttended ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <div
                                                    className={`dot absolute w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ease-in-out ${
                                                        isAttended ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                                ></div>
                                            </label>
                                            {isAttended && <span className="text-green-500 font-bold">Attended</span>}
                                        </div>
                                    </div>
                                    <div className="flex justify-end items-center mt-8">
                                        <button onClick={() => setModal10(false)} type="button" className="btn btn-outline-danger">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Modal;
