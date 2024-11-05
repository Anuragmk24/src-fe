import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconEye from '../icon/icon-eye';

function AccomodationModal({ users, spouse }: { users: any; spouse?: any }) {
    console.log('spouse ===============> ', spouse);
    const [isOpen, setIsOpen] = useState(false);
    console.log('users =============> ', users);

    const memberTypes = users.map((user:any) => user.user.memberType);
    console.log("membertypes",memberTypes)

    const calculateAccommodationAmount = () => {
        if (!users || users.length === 0) return null;

        const firstUser = users[0];
        const isBringingSpouse = firstUser?.user?.isBringingSpouse;
        const memberType = firstUser?.user?.memberType;

        // Calculate based on member type and spouse status
        if (memberType === "IIA_MEMBER") {
            return isBringingSpouse ? 8000 : 4000* users?.length ;
        } else if (memberType === "NON_IIA_MEMBER") {
            return 4500 * users?.length;
        }
    };

    return (
        <div>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-flex items-center p-2 hover:bg-gray-200 rounded-md">
                <IconEye className="h-5 w-5 text-gray-600" />
                <span className="ml-2 text-sm font-medium text-gray-600">View</span>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">
                                        Accomodation Details
                                    </Dialog.Title>

                                    {users && users.length > 0 ? (
                                        <ul className="space-y-4">
                                            {users.map((user: any, index: number) => (
                                                <li key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
                                                    <div className="font-semibold text-gray-700">{`${user.firstName} ${user.lastName}`}</div>
                                                    <div className="text-sm text-gray-500">Email: {user.email}</div>
                                                    <div className="text-sm text-gray-500">Mobile: {user.mobile}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-center text-gray-500">No group members found.</p>
                                    )}

                                    {spouse.length !==  0 ? (
                                        <div className="p-4 my-3 border rounded-md shadow-sm bg-gray-50">
                                            <h1>Spouse Details</h1>
                                            <div className="font-semibold text-gray-700">{`${spouse[0].firstName} ${spouse[0].lastName}`}</div>
                                            <div className="text-sm text-gray-500">Email: {spouse[0].email}</div>
                                            <div className="text-sm text-gray-500">Mobile: {spouse[0].mobile}</div>
                                        </div>
                                    ) : null}
                                    <p className="my-6 font-medium text-sm">Accommodation Amount: {calculateAccommodationAmount()} INR</p>

                                    <div className="mt-6 flex justify-end">
                                        <button type="button" className="btn btn-primary" onClick={() => setIsOpen(false)}>
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default AccomodationModal;
